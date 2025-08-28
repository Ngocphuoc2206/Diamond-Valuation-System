# Build stage
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

COPY HivMedical.NotificationService.sln ./
COPY Notification.Api/ Notification.Api/
COPY Notification.Application/ Notification.Application/
COPY Notification.Domain/ Notification.Domain/
COPY Notification.Infrastructure/ Notification.Infrastructure/

RUN dotnet restore "HivMedical.NotificationService.sln"
RUN dotnet build "HivMedical.NotificationService.sln" -c Release -o /app/build
RUN dotnet publish "Notification.Api/Notification.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Notification.Api.dll"]
