# =====================================
# Build stage
# =====================================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy file csproj của API và restore (tự động kéo project con nếu .csproj tham chiếu)
COPY Diamond.ValuationService.Api/*.csproj ./Diamond.ValuationService.Api/
COPY Diamond.ValuationService.Application/*.csproj ./Diamond.ValuationService.Application/
COPY Diamond.ValuationService.Domain/*.csproj ./Diamond.ValuationService.Domain/
COPY Diamond.ValuationService.Infrastructure/*.csproj ./Diamond.ValuationService.Infrastructure/
COPY SharedLibrary/SharedLibrary.csproj SharedLibrary/
COPY *.sln ./

RUN dotnet restore Diamond.ValuationService.Api/Diamond.ValuationService.Api.csproj

# Copy toàn bộ source rồi publish
COPY . .
RUN dotnet publish Diamond.ValuationService.Api/Diamond.ValuationService.Api.csproj \
    -c Release -o /app/publish --no-self-contained

# =====================================
# Runtime stage
# =====================================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy publish
COPY --from=build /app/publish ./

# Lắng nghe 8080
ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_EnableDiagnostics=0 \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=0 \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8

EXPOSE 8080
ENTRYPOINT ["dotnet", "Diamond.ValuationService.Api.dll"]
