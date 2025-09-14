namespace SharedLibrary.Response;

public class ApiResponse<T>
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public T? Data { get; init; }
    public Dictionary<string, string[]>? Errors { get; init; }

    public static ApiResponse<T> Ok(T data, string msg = "") => new() { Success = true, Data = data, Message = msg };
    public static ApiResponse<T> Fail(string msg, Dictionary<string, string[]>? errors = null)
        => new() { Success = false, Message = msg, Errors = errors };
}
