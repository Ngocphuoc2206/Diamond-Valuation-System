# Dùng .NET 9 SDK để build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy toàn bộ solution
COPY . .

# Restore các dependency
RUN dotnet restore "Product.Api/Product.Api.csproj"

# Build & Publish
RUN dotnet publish "Product.Api/Product.Api.csproj" -c Release -o /app/publish

# Runtime image (chỉ chứa runtime, nhẹ hơn)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Product.Api.dll"]
