using Order.Application.DTOs;
using Order.Application.Interfaces;
using Order.Application.Services.Interfaces;
using Order.Domain.Entities;
using SharedLibrary.Response;

namespace Order.Application.Services;

public class CartService : ICartService
{
    private readonly IUnitOfWork _uow;
    public CartService(IUnitOfWork uow) { _uow = uow; }

    public async Task<ApiResponse<Cart>> CreateOrGetAsync(string? cartKey, int? customerId)
    {
        Cart? cart = null;
        // Kiểm tra nếu đã đăng nhập thì lấy giỏ hàng theo CustomerId
        if (!string.IsNullOrWhiteSpace(cartKey))
            cart = await _uow.Carts.GetByAsync(c => c.CartKey == cartKey);

        // Nếu chưa có giỏ hàng theo cartKey, Tạo mới hoặc lấy theo CustomerId
        if (cart is null)
        {
            cart = new Cart { CustomerId = customerId };
            await _uow.Carts.CreateAsync(cart);
        }
        return ApiResponse<Cart>.CreateSuccessResponse(cart!, "Ok");
    }

    public async Task<ApiResponse<Cart>> GetAsync(string cartKey)
    {
        // Lấy giỏ hàng theo cartKey
        var cart = await _uow.Carts.GetByAsync(c => c.CartKey == cartKey);
        if (cart is null) return ApiResponse<Cart>.Failure("Cart not found");
        cart.Items = (await _uow.CartItems.GetManyAsync(ci => ci.CartId == cart.Id)).ToList();
        return ApiResponse<Cart>.CreateSuccessResponse(cart, "Ok");
    }

    public async Task<ApiResponse<Cart>> AddItemAsync(string cartKey, AddCartItemDto dto)
    {
        var cart = (await GetAsync(cartKey)).Data;
        if (cart is null) return ApiResponse<Cart>.Failure("Cart not found");

        // gọi Catalog để validate SKU & giá nếu cần
        var item = new CartItem { CartId = cart.Id, Sku = dto.Sku.Trim(), Quantity = dto.Quantity, UnitPrice = dto.UnitPrice };
        await _uow.CartItems.CreateAsync(item);
        return await GetAsync(cartKey);
    }

    public async Task<ApiResponse<Cart>> UpdateItemAsync(string cartKey, UpdateCartItemDto dto)
    {
        // Kiểm tra giỏ hàng theo cartKey
        var cart = (await GetAsync(cartKey)).Data;
        if (cart is null) return ApiResponse<Cart>.Failure("Cart not found");

        // Kiểm tra item theo CartItemId
        var item = await _uow.CartItems.GetByIdAsync(dto.CartItemId);
        if (item is null || item.CartId != cart.Id) return ApiResponse<Cart>.Failure("Item not found");

        item.Quantity = dto.Quantity;
        await _uow.CartItems.UpdateAsync(item);
        return await GetAsync(cartKey);
    }

    public async Task<ApiResponse<Cart>> RemoveItemAsync(string cartKey, int cartItemId)
    {
        var cart = (await GetAsync(cartKey)).Data;
        if (cart is null) return ApiResponse<Cart>.Failure("Cart not found");

        var item = await _uow.CartItems.GetByIdAsync(cartItemId);
        if (item is null || item.CartId != cart.Id) return ApiResponse<Cart>.Failure("Item not found");

        await _uow.CartItems.DeleteAsync(item);
        return await GetAsync(cartKey);
    }
}
