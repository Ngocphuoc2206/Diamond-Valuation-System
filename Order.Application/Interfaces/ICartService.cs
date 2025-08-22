using SharedLibrary.Response;
using Order.Application.DTOs;
using Order.Domain.Entities;

namespace Order.Application.Services.Interfaces;

public interface ICartService
{
    Task<ApiResponse<Cart>> CreateOrGetAsync(string? cartKey, int? customerId);
    Task<ApiResponse<Cart>> GetAsync(string cartKey);
    Task<ApiResponse<Cart>> AddItemAsync(string cartKey, AddCartItemDto dto);
    Task<ApiResponse<Cart>> UpdateItemAsync(string cartKey, UpdateCartItemDto dto);
    Task<ApiResponse<Cart>> RemoveItemAsync(string cartKey, int cartItemId);
}
