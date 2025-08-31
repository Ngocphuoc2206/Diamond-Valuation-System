# build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore DiamondValuationSystem.sln
RUN dotnet publish InvoiceService/InvoiceService.Api/InvoiceService.Api.csproj -c Release -o /app/publish

# run
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "InvoiceService.Api.dll"]
