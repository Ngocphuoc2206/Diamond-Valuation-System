namespace SharedLibrary.Response;

public class ApiResponse<T>
{
    public bool Success { get; set; } = true;
    public string Message { get; set; } = "OK";
    public T? Data { get; set; }

    public static ApiResponse<T> Ok(T data, string? message = null)
        => new() { Success = true, Data = data, Message = message ?? "OK" };

    public static ApiResponse<T> Fail(string message)
        => new() { Success = false, Message = message };
}
