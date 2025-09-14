using Order.Application.DTOs;
using Order.Domain.Entities;

namespace Order.Application.Mappings;

public static class CartMapping
{
    public static CartItemDto ToDto(this CartItem x) => new()
    {
        Id = x.Id,
        Sku = x.Sku,
        Quantity = x.Quantity,
        UnitPrice = x.UnitPrice,
        LineTotal = x.Quantity * x.UnitPrice,
        Name = x.Name,
        ImageUrl = x.ImageUrl
    };

    public static CartDto ToDto(this Cart c) => new()
    {
        Id = c.Id,
        CartKey = c.CartKey,
        CustomerId = c.CustomerId,
        Items = c.Items.Select(ToDto).ToList(),
        Subtotal = c.Items.Sum(i => i.Quantity * i.UnitPrice),
        Total = c.Items.Sum(i => i.Quantity * i.UnitPrice)
    };
}
