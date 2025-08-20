# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution
COPY ["ReportingService.sln", "./"]

# Copy tất cả csproj cần thiết
COPY ["Reporting.Api/Reporting.Api.csproj", "Reporting.Api/"]
COPY ["Reporting.Application/Reporting.Application.csproj", "Reporting.Application/"]
COPY ["Reporting.Domain/Reporting.Domain.csproj", "Reporting.Domain/"]
COPY ["Reporting.Infrastructure/Reporting.Infrastructure.csproj", "Reporting.Infrastructure/"]
COPY ["Reporting.Shared/Reporting.Shared.csproj", "Reporting.Shared/"]

# Restore
RUN dotnet restore "ReportingService.sln"

# Copy toàn bộ source
COPY . .

# Build & publish
RUN dotnet publish "Reporting.Api/Reporting.Api.csproj" -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Reporting.Api.dll"]
