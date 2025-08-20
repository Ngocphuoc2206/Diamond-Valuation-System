using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SharedLibrary.Messaging.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace SharedLibrary.Messaging
{
    public class RabbitMQEventBus : IEventBus, IDisposable
    {
        private readonly ConnectionFactory _connectionFactory; // Updated to use RabbitMQ.Client.ConnectionFactory
        private readonly ILogger<RabbitMQEventBus> _logger;
        private readonly IConnection _connection;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IChannel _channel;
        private readonly Dictionary<string, List<Type>> _handlers;
        private readonly List<Type> _eventTypes;
        private readonly JsonSerializerOptions _jsonOptions;

        public RabbitMQEventBus(ConnectionFactory connectionFactory, IServiceScopeFactory scopeFactory,
                               ILogger<RabbitMQEventBus> logger)
        {
            _connectionFactory = connectionFactory;
            _logger = logger;
            _scopeFactory = scopeFactory;
            _handlers = new Dictionary<string, List<Type>>();
            _eventTypes = new List<Type>();

            // Configure JSON serialization options for better compatibility
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            };

            try
            {
                _connection = _connectionFactory.CreateConnectionAsync().GetAwaiter().GetResult();
                _channel = _connection.CreateChannelAsync().GetAwaiter().GetResult();

                _logger.LogInformation("RabbitMQ connection established");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not connect to RabbitMQ");
                throw;
            }
        }

        public void Dispose()
        {
            _channel?.CloseAsync();
            _connection?.CloseAsync();
        }

        public void Publish<T>(T @event) where T : class
        {
            var eventName = @event.GetType().Name;
            _logger.LogInformation("Publishing event {EventName}", eventName);

            try
            {
                _channel.QueueDeclareAsync(queue: eventName,
                                     durable: true,
                                     exclusive: false,
                                     autoDelete: false);

                var message = JsonSerializer.Serialize(@event, _jsonOptions);
                _logger.LogDebug("Publishing event JSON: {EventJson}", message);
                var body = Encoding.UTF8.GetBytes(message);

                // Fix: Add the 'mandatory' parameter to match the correct overload of BasicPublishAsync
                var properties = new BasicProperties
                {
                    Persistent = true
                };

                _channel.BasicPublishAsync(
                    exchange: "",
                    routingKey: eventName,
                    mandatory: false, // Added mandatory parameter
                    basicProperties: properties,
                    body: body);

                _logger.LogInformation("Event {EventName} published successfully", eventName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing event {EventName}", eventName);
                throw;
            }
        }

        public void Subscribe<T, TH>()
            where T : class
            where TH : IEventHandler<T>
        {
            var eventName = typeof(T).Name;
            var handlerType = typeof(TH);

            if (!_handlers.ContainsKey(eventName))
            {
                _handlers.Add(eventName, new List<Type>());

                _channel.QueueDeclareAsync(queue: eventName,
                                     durable: true,
                                     exclusive: false,
                                     autoDelete: false);

                var consumer = new AsyncEventingBasicConsumer(_channel);
                consumer.ReceivedAsync += async (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    var message = Encoding.UTF8.GetString(body);
                    await ProcessEvent(eventName, message);
                };

                _channel.BasicConsumeAsync(queue: eventName,
                                     autoAck: true,
                                     consumer: consumer);
            }

            if (_handlers[eventName].Any(h => h == handlerType))
            {
                _logger.LogWarning("Handler Type {HandlerType} already registered for {EventName}", handlerType.Name, eventName);
                return;
            }

            _handlers[eventName].Add(handlerType);
            _logger.LogInformation("Subscribed to event {EventName} with {HandlerType}", eventName, handlerType.Name);
        }

        private async Task ProcessEvent(string eventName, string message)
        {
            if (!_handlers.ContainsKey(eventName))
            {
                _logger.LogWarning("No handler registered for {EventName}", eventName);
                return;
            }

            using var scope = _scopeFactory.CreateScope();
            var handlers = _handlers[eventName];

            foreach (var handlerType in handlers)
            {
                try
                {
                    var handler = scope.ServiceProvider.GetService(handlerType);
                    if (handler == null)
                    {
                        _logger.LogWarning("Handler {HandlerType} not registered in DI", handlerType.Name);
                        continue;
                    }

                    // Get the event type from the handler's generic argument
                    var eventType = handlerType.GetInterfaces()
                        .FirstOrDefault(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IEventHandler<>))
                        ?.GetGenericArguments().FirstOrDefault();

                    if (eventType == null)
                    {
                        _logger.LogError("Could not determine event type for handler {HandlerType}", handlerType.Name);
                        continue;
                    }

                    var concreteType = typeof(IEventHandler<>).MakeGenericType(eventType);
                    _logger.LogDebug("Deserializing event {EventName} JSON: {EventJson}", eventName, message);
                    var eventData = JsonSerializer.Deserialize(message, eventType, _jsonOptions);

                    await (Task)concreteType.GetMethod("Handle").Invoke(handler, new[] { eventData });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing event {EventName}", eventName);
                }
            }
        }
    }
}