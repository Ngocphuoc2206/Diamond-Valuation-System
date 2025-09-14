using SharedLibrary.Messaging.Interfaces;
using SharedLibrary.Messaging.Events;
using Microsoft.Extensions.Logging;
using Inventory.Application.Interfaces;

namespace Inventory.Application.Handlers;

public class OrderCreatedEventHandler : IEventHandler<OrderCreatedEvent>
{
    private readonly ILogger<OrderCreatedEventHandler> _logger;
    private readonly IEventBus _eventBus;
    private readonly IInventoryService _inventoryService;

    public OrderCreatedEventHandler(
        ILogger<OrderCreatedEventHandler> logger,
        IEventBus eventBus,
        IInventoryService inventoryService)
    {
        _logger = logger;
        _eventBus = eventBus;
        _inventoryService = inventoryService;
    }

    public async Task Handle(OrderCreatedEvent e)
    {
        _logger.LogInformation("[Inventory] Nhận OrderCreatedEvent cho {OrderNo}", e.OrderNo);

        // Idempotency nội bộ theo OrderNo
        var reserved = await _inventoryService.TryReserveAsync(e.OrderNo, e.Items);
        if (reserved.Success)
        {
            _eventBus.Publish(new InventoryReservedEvent(e.OrderNo, true, null));
            _logger.LogInformation("[Inventory] Đặt giữ tồn kho thành công cho {OrderNo}", e.OrderNo);
        }
        else
        {
            _eventBus.Publish(new InventoryReservedEvent(e.OrderNo, false, reserved.Reason));
            _logger.LogWarning("[Inventory] Đặt giữ tồn kho THẤT BẠI cho {OrderNo}: {Reason}", e.OrderNo, reserved.Reason);
        }
    }
}
