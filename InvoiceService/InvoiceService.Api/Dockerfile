# ---------- build stage ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Chỉ copy csproj để tận dụng cache restore
COPY InvoiceService.Api/InvoiceService.Api.csproj                 InvoiceService.Api/
COPY InvoiceService.Application/InvoiceService.Application.csproj InvoiceService.Application/
COPY InvoiceService.Domain/InvoiceService.Domain.csproj           InvoiceService.Domain/
COPY InvoiceService.Infrastructure/InvoiceService.Infrastructure.csproj InvoiceService.Infrastructure/
COPY SharedLibrary/SharedLibrary.csproj                           SharedLibrary/

# Restore theo API csproj (tự kéo các project tham chiếu)
RUN dotnet restore InvoiceService.Api/InvoiceService.Api.csproj

# Copy toàn bộ source và publish
COPY . .
RUN dotnet publish InvoiceService.Api/InvoiceService.Api.csproj \
    -c Release -o /app/publish /p:UseAppHost=false

# ---------- runtime stage ----------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "InvoiceService.Api.dll"]
