# --- Build stage ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# copy các file .csproj để restore
COPY Diamond.ValuationService.Domain/Diamond.ValuationService.Domain.csproj Diamond.ValuationService.Domain/
COPY Diamond.ValuationService.Application/Diamond.ValuationService.Application.csproj Diamond.ValuationService.Application/
COPY Diamond.ValuationService.Infrastructure/Diamond.ValuationService.Infrastructure.csproj Diamond.ValuationService.Infrastructure/
COPY Diamond.ValuationService.Api/Diamond.ValuationService.Api.csproj Diamond.ValuationService.Api/

# restore nuget package
RUN dotnet restore Diamond.ValuationService.Api/Diamond.ValuationService.Api.csproj

# copy toàn bộ source
COPY . .

# publish API ra thư mục /app/publish
RUN dotnet publish Diamond.ValuationService.Api/Diamond.ValuationService.Api.csproj -c Release -o /app/publish

# --- Runtime stage ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Diamond.ValuationService.Api.dll"]
