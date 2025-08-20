namespace SharedLibrary.Messaging;

public class RabbitMQEventBus : IEventBus
{
    public Task PublishAsync<T>(T @event, CancellationToken ct = default)
    {
        // TODO: implement RabbitMQ publish
        return Task.CompletedTask;
    }
}
