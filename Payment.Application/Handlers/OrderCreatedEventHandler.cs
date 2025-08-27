using SharedLibrary.Messaging.Interfaces;
using SharedLibrary.Messaging.Events;
using Microsoft.Extensions.Logging;
using Payment.Domain.Services.Interfaces;
using Payment.Application.DTOs;

namespace Payment.Application.Handlers;

public class OrderCreatedEventHandler : IEventHandler<OrderCreatedEvent>
{
    private readonly ILogger<OrderCreatedEventHandler> _logger;
    private readonly IEventBus _eventBus;
    private readonly IPaymentService _paymentService;
    // inject DbContext/Service nếu cần

    public OrderCreatedEventHandler(ILogger<OrderCreatedEventHandler> logger, IEventBus eventBus, IPaymentService paymentService)
    {
        _logger = logger;
        _eventBus = eventBus;
        _paymentService = paymentService;
    }

    public async Task Handle(OrderCreatedEvent e)
    {
        _logger.LogInformation("[Payment] Nhận OrderCreatedEvent: {OrderNo} - Total {Total}", e.OrderNo, e.Total);

        var paymentId = Guid.NewGuid().ToString("N");
        var status = "Succeeded";

        // Tạo Payment Intent

        try
        {
            if (e.IdempotencyKey == null)
            {
                _logger.LogError("[Payment] Lỗi khi tạo Payment Intent cho Order {OrderNo}", e.OrderNo);
                status = "Failed";
            }
            var dto = new CreatePaymentDto(e.OrderNo, e.Total, "Fake");
            await _paymentService.CreateAsync(dto, e.IdempotencyKey);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[Payment] Lỗi khi tạo Payment Intent cho Order {OrderNo}", e.OrderNo);
            status = "Failed";
        }

        // Publish kết quả thanh toán
        _eventBus.Publish(new PaymentCompletedEvent(e.OrderNo, paymentId, status, e.Total));
        _logger.LogInformation("[Payment] Publish PaymentCompletedEvent: {OrderNo} - {PaymentId} - {Status}",
            e.OrderNo, paymentId, status);
        await Task.CompletedTask;
    }
}
