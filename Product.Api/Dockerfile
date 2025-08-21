# build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ../Product.Domain/Product.Domain.csproj Product.Domain/
COPY ../Product.Application/Product.Application.csproj Product.Application/
COPY ../Product.Infrastructure/Product.Infrastructure.csproj Product.Infrastructure/
COPY Product.Api/Product.Api.csproj Product.Api/

RUN dotnet restore Product.Api/Product.Api.csproj

COPY ../Product.Domain Product.Domain
COPY ../Product.Application Product.Application
COPY ../Product.Infrastructure Product.Infrastructure
COPY Product.Api Product.Api

RUN dotnet publish Product.Api/Product.Api.csproj -c Release -o /app

# run
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Product.Api.dll"]
