# STAGE 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
EXPOSE 8080

# copy csproj để restore
COPY Inventory.Api/Inventory.Api.csproj Inventory.Api/
COPY Inventory.Application/Inventory.Application.csproj Inventory.Application/
COPY Inventory.Infrastructure/Inventory.Infrastructure.csproj Inventory.Infrastructure/
COPY Inventory.Domain/Inventory.Domain.csproj Inventory.Domain/

RUN dotnet restore Inventory.Api/Inventory.Api.csproj

# copy toàn bộ source và publish
COPY . .
RUN dotnet publish Inventory.Api/Inventory.Api.csproj -c Release -o /out

# STAGE 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /out .
ENTRYPOINT ["dotnet","Inventory.Api.dll"]
