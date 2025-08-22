# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy all project files
COPY Catalog.Api/*.csproj Catalog.Api/
COPY Catalog.Application/*.csproj Catalog.Application/
COPY Catalog.Infrastructure/*.csproj Catalog.Infrastructure/
COPY SharedLibrary/*.csproj SharedLibrary/
COPY SharedKernel/*.csproj SharedKernel/

# Restore only
RUN dotnet restore Catalog.Api/Catalog.Api.csproj

# Copy everything else
COPY . .

WORKDIR /src/Catalog.Api
RUN dotnet publish -c Release -o /app/out

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "Catalog.Api.dll"]
