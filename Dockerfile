# STAGE 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
EXPOSE 8080

# copy csproj để restore
COPY Pricing.Api/Pricing.Api.csproj Pricing.Api/
COPY Pricing.Application/Pricing.Application.csproj Pricing.Application/
COPY Pricing.Infrastructure/Pricing.Infrastructure.csproj Pricing.Infrastructure/
COPY Pricing.Domain/Pricing.Domain.csproj Pricing.Domain/
COPY SharedLibrary/SharedLibrary.csproj SharedLibrary/
COPY SharedKernel/SharedKernel.csproj   SharedKernel/

RUN dotnet restore Pricing.Api/Pricing.Api.csproj

# copy toàn bộ source và publish
COPY . .
RUN dotnet publish Pricing.Api/Pricing.Api.csproj -c Release -o /out

# STAGE 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /out .
ENTRYPOINT ["dotnet","Pricing.Api.dll"]
