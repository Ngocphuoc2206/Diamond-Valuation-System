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

    private async Task<Cart> ResolveOrCreateAsync(string? cartKey, int? customerId, bool isCustomerRole)
    {
        Cart? cart = null;

        if (isCustomerRole)
        {
            if (!string.IsNullOrWhiteSpace(cartKey))
                cart = await _uow.Carts.GetByAsync(c => c.CartKey == cartKey);

            if (cart is null)
            {
                cart = new Cart
                {
                    CartKey = string.IsNullOrWhiteSpace(cartKey) ? Guid.NewGuid().ToString("N") : cartKey
                };
                await _uow.Carts.CreateAsync(cart);
            } 
        }
        else
        {
            if (customerId.HasValue)
                cart = await _uow.Carts.GetByAsync(c => c.CustomerId == customerId.Value);

            if (cart is null)
            {
                cart = new Cart { CustomerId = customerId };
                await _uow.Carts.CreateAsync(cart);
            }
        }

        await LoadItemsAsync(cart);
        Recalc(cart);
        await _uow.Carts.UpdateAsync(cart);
        await _uow.SaveChangesAsync();
        return cart;
    }


    // ================== APIs =====================

    // Tạo hoặc lấy giỏ
    public async Task<CartDto> CreateOrGetAsync(string? cartKey, int? customerId, bool isCustomerRole)
    {
        var cart = await ResolveOrCreateAsync(cartKey, customerId, isCustomerRole);
        return cart.ToDto();
    }

    // GET theo cartKey (trả ApiResponse<CartDto>)
    public async Task<ApiResponse<CartDto>> GetAsync(string? cartKey, int? customerId, bool isCustomerRole)
    {
        var cart = await ResolveOrCreateAsync(cartKey, customerId, isCustomerRole);
        return ApiResponse<CartDto>.CreateSuccessResponse(cart.ToDto(), "Ok");
    }

    public async Task<ApiResponse<CartDto>> AddItemAsync(string? cartKey, int? customerId, bool isCustomerRole, AddCartItemDto dto)
    {
        var cart = await ResolveOrCreateAsync(cartKey, customerId, isCustomerRole);

        var existed = cart.Items.FirstOrDefault(i => i.Sku == dto.Sku);
        if (existed is null)
        {
            var item = new CartItem
            {
                CartId = cart.Id,
                Sku = dto.Sku,
                Quantity = dto.Quantity,
                UnitPrice = dto.UnitPrice,
                Name = dto.Name,
                ImageUrl = dto.ImageUrl
            };
            await _uow.CartItems.CreateAsync(item);
        }
        else
        {
            existed.Quantity += dto.Quantity;
            existed.UnitPrice = dto.UnitPrice;
            await _uow.CartItems.UpdateAsync(existed);
        }

        await LoadItemsAsync(cart);
        Recalc(cart);
        await _uow.Carts.UpdateAsync(cart);
        await _uow.SaveChangesAsync();

        return ApiResponse<CartDto>.CreateSuccessResponse(cart.ToDto(), "Ok");
    }

    public async Task<ApiResponse<CartDto>> UpdateItemAsync(string? cartKey, int? customerId, bool isCustomerRole, UpdateCartItemDto dto)
    {
        var cart = await ResolveOrCreateAsync(cartKey, customerId, isCustomerRole);
        var item = cart.Items.FirstOrDefault(i => i.Id == dto.CartItemId);
        if (item is null) return ApiResponse<CartDto>.Failure("Item not found");

        item.Quantity = dto.Quantity;
        item.UnitPrice = dto.UnitPrice;
        await _uow.CartItems.UpdateAsync(item);

        await LoadItemsAsync(cart);
        Recalc(cart);
        await _uow.Carts.UpdateAsync(cart);
        await _uow.SaveChangesAsync();

        return ApiResponse<CartDto>.CreateSuccessResponse(cart.ToDto(), "Ok");
    }


    public async Task<ApiResponse<CartDto>> RemoveItemAsync(string? cartKey, int? customerId, bool isCustomerRole, int cartItemId)
    {
        var cart = await ResolveOrCreateAsync(cartKey, customerId, isCustomerRole);
        var item = cart.Items.FirstOrDefault(i => i.Id == cartItemId);
        if (item is null) return ApiResponse<CartDto>.Failure("Item not found");

        await _uow.CartItems.DeleteAsync(item);

        await LoadItemsAsync(cart);
        Recalc(cart);
        await _uow.Carts.UpdateAsync(cart);
        await _uow.SaveChangesAsync();

        return ApiResponse<CartDto>.CreateSuccessResponse(cart.ToDto(), "Ok");
    }
}
