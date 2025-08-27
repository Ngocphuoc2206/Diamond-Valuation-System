using SharedLibrary.Response;
using Order.Application.DTOs;
using Order.Domain.Entities;

namespace Order.Application.Services.Interfaces;

public interface ICartService
{
    Task<CartDto> CreateOrGetAsync(string? cartKey, int? customerId);
    Task<ApiResponse<CartDto>> GetAsync(string cartKey);
    Task<ApiResponse<CartDto>> AddItemAsync(string cartKey, AddCartItemDto dto);
    Task<ApiResponse<CartDto>> UpdateItemAsync(string cartKey, UpdateCartItemDto dto);
    Task<ApiResponse<CartDto>> RemoveItemAsync(string cartKey, int cartItemId);
}
