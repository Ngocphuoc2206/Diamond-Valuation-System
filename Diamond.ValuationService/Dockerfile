# ================================
# 1) Build stage
# ================================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# copy csproj và restore
COPY Diamond.ValuationService.Api/*.csproj Diamond.ValuationService.Api/
COPY Diamond.ValuationService.Application/*.csproj Diamond.ValuationService.Application/
COPY Diamond.ValuationService.Domain/*.csproj Diamond.ValuationService.Domain/
COPY Diamond.ValuationService.Infrastructure/*.csproj Diamond.ValuationService.Infrastructure/
COPY *.sln ./

RUN dotnet restore Diamond.ValuationService.Api/Diamond.ValuationService.Api.csproj

# copy toàn bộ source và publish
COPY . .
RUN dotnet publish Diamond.ValuationService.Api/Diamond.ValuationService.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# ================================
# 2) Runtime stage
# ================================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish ./

# lắng nghe HTTP 8080
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Diamond.ValuationService.Api.dll"]
