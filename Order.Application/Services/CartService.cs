using Microsoft.EntityFrameworkCore;
using Order.Application.DTOs;
using Order.Application.Interfaces;
using Order.Application.Mappings;
using Order.Application.Services.Interfaces;
using Order.Domain.Entities;
using SharedLibrary.Response;

namespace Order.Application.Services;

public class CartService : ICartService
{
    private readonly IUnitOfWork _uow;
    public CartService(IUnitOfWork uow) { _uow = uow; }

    // ================== Helpers ==================
    private static void Recalc(Cart cart)
    {
        cart.Total = cart.Items.Sum(i => i.UnitPrice * i.Quantity);
        cart.UpdatedAt = DateTime.UtcNow;
    }

    private async Task LoadItemsAsync(Cart cart)
    {
        cart.Items = (await _uow.CartItems.GetManyAsync(ci => ci.CartId == cart.Id)).ToList();
    }

    // ================== APIs =====================

    // Tạo hoặc lấy giỏ
    public async Task<CartDto> CreateOrGetAsync(string? cartKey, int? customerId)
    {
        Cart? cart = null;

        if (!string.IsNullOrWhiteSpace(cartKey))
        {
            cart = await _uow.Carts.GetByAsync(c => c.CartKey == cartKey);
        }
        else if (customerId.HasValue)
        {
            cart = await _uow.Carts.GetByAsync(c => c.CustomerId == customerId);
        }

        if (cart is null)
        {
            cart = new Cart
            {
                CartKey = string.IsNullOrWhiteSpace(cartKey) ? Guid.NewGuid().ToString("N") : cartKey!,
                CustomerId = customerId,
                Total = 0
            };
            await _uow.Carts.CreateAsync(cart);
        }

        await LoadItemsAsync(cart);
        Recalc(cart);                                    // chỉ tính trong RAM, không ghi DB ở GET
        return cart.ToDto();
    }

    // GET theo cartKey (trả ApiResponse<CartDto>)
    public async Task<ApiResponse<CartDto>> GetAsync(string cartKey)
    {
        var cart = await _uow.Carts.GetByAsync(c => c.CartKey == cartKey);
        if (cart is null) return ApiResponse<CartDto>.Failure("Cart not found");

        await LoadItemsAsync(cart);
        Recalc(cart);                                    // không ghi DB ở GET
        return ApiResponse<CartDto>.CreateSuccessResponse(cart.ToDto(), "Ok");
    }

    public async Task<ApiResponse<CartDto>> AddItemAsync(string cartKey, AddCartItemDto dto)
    {
        if (string.IsNullOrWhiteSpace(cartKey))
            return ApiResponse<CartDto>.Failure("Cart key is required");
        if (dto is null || string.IsNullOrWhiteSpace(dto.Sku) || dto.Quantity <= 0)
            return ApiResponse<CartDto>.Failure("Invalid payload");

        var cart = await _uow.Carts.GetByAsync(c => c.CartKey == cartKey);
        if (cart is null) return ApiResponse<CartDto>.Failure("Cart not found");

        await LoadItemsAsync(cart);

        var normSku = dto.Sku.Trim();
        var existed = cart.Items.FirstOrDefault(i => i.Sku == normSku);
        if (existed is null)
        {
            var item = new CartItem
            {
                CartId = cart.Id,
                Sku = normSku,
                Quantity = dto.Quantity,
                UnitPrice = dto.UnitPrice,
                Name = dto.Name ?? string.Empty,
                ImageUrl = dto.ImageUrl
            };
            await _uow.CartItems.CreateAsync(item);
            await _uow.SaveChangesAsync();
        }
        else
        {
            existed.Quantity += dto.Quantity;
            existed.UnitPrice = dto.UnitPrice;
            await _uow.CartItems.UpdateAsync(existed);
        }

        await LoadItemsAsync(cart);                      // reload để chắc chắn số liệu mới
        Recalc(cart);
        await _uow.Carts.UpdateAsync(cart);
        await _uow.SaveChangesAsync();
        return ApiResponse<CartDto>.CreateSuccessResponse(cart.ToDto(), "Ok");
    }

    public async Task<ApiResponse<CartDto>> UpdateItemAsync(string cartKey, UpdateCartItemDto dto)
    {
        var cart = await _uow.Carts.GetByAsync(c => c.CartKey == cartKey);
        if (cart is null) return ApiResponse<CartDto>.Failure("Cart not found");

        await LoadItemsAsync(cart);

        var item = cart.Items.FirstOrDefault(i => i.Id == dto.CartItemId);
        if (item is null) return ApiResponse<CartDto>.Failure("Item not found");

        if (dto.Quantity <= 0)
        {
            await _uow.CartItems.DeleteAsync(item);
        }
        else
        {
            item.Quantity = dto.Quantity;
            await _uow.CartItems.UpdateAsync(item);
        }

        await LoadItemsAsync(cart);
        Recalc(cart);
        await _uow.Carts.UpdateAsync(cart);

        return ApiResponse<CartDto>.CreateSuccessResponse(cart.ToDto(), "Ok");
    }

    public async Task<ApiResponse<CartDto>> RemoveItemAsync(string cartKey, int cartItemId)
    {
        var cart = await _uow.Carts.GetByAsync(c => c.CartKey == cartKey);
        if (cart is null) return ApiResponse<CartDto>.Failure("Cart not found");

        var item = await _uow.CartItems.GetByIdAsync(cartItemId);
        if (item is null || item.CartId != cart.Id)
            return ApiResponse<CartDto>.Failure("Item not found");

        await _uow.CartItems.DeleteAsync(item);

        await LoadItemsAsync(cart);
        Recalc(cart);
        await _uow.Carts.UpdateAsync(cart);

        return ApiResponse<CartDto>.CreateSuccessResponse(cart.ToDto(), "Ok");
    }
}
