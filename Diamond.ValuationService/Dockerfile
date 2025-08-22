# ================================
# 1) Build stage
# ================================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj trước để cache restore
COPY Diamond.ValuationService.Api/Diamond.ValuationService.Api.csproj Diamond.ValuationService.Api/
COPY Diamond.ValuationService.Infrastructure/Diamond.ValuationService.Infrastructure.csproj Diamond.ValuationService.Infrastructure/
COPY Diamond.ValuationService.Application/Diamond.ValuationService.Application.csproj Diamond.ValuationService.Application/
COPY Diamond.ValuationService.Domain/Diamond.ValuationService.Domain.csproj Diamond.ValuationService.Domain/
# (Nếu có .sln) COPY Diamond.ValuationService.sln ./

RUN dotnet restore Diamond.ValuationService.Api/Diamond.ValuationService.Api.csproj

# Copy toàn bộ source rồi build
COPY . .
RUN dotnet publish Diamond.ValuationService.Api/Diamond.ValuationService.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# ================================
# 2) Runtime stage (ASP.NET)
# ================================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Chạy non-root
RUN useradd -m appuser
USER appuser

# App listen 0.0.0.0:8080
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

# (Tùy chọn) timezone VN cho log
# RUN ln -snf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime && echo "Asia/Ho_Chi_Minh" | sudo tee /etc/timezone

COPY --from=build /app/publish ./

# Nếu bạn đã bật db.Database.Migrate() ở Program.cs thì không cần chạy dotnet-ef trong container
ENTRYPOINT ["dotnet", "Diamond.ValuationService.Api.dll"]
