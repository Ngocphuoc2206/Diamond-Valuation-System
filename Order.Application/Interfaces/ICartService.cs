using Order.Application.DTOs;
using SharedLibrary.Response;

public interface ICartService
{
    Task<CartDto> CreateOrGetAsync(string? cartKey, int? customerId, bool isCustomerRole);

    Task<ApiResponse<CartDto>> GetAsync(string? cartKey, int? customerId, bool isCustomerRole);
    Task<ApiResponse<CartDto>> AddItemAsync(string? cartKey, int? customerId, bool isCustomerRole, AddCartItemDto dto);
    Task<ApiResponse<CartDto>> UpdateItemAsync(string? cartKey, int? customerId, bool isCustomerRole, UpdateCartItemDto dto);
    Task<ApiResponse<CartDto>> RemoveItemAsync(string? cartKey, int? customerId, bool isCustomerRole, int cartItemId);
}
