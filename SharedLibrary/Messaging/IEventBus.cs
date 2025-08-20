namespace SharedLibrary.Messaging;

public interface IEventBus
{
    Task PublishAsync<T>(T @event, CancellationToken ct = default);
}
