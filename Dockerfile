# STAGE 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
EXPOSE 8080

# copy csproj để restore
COPY UserService.Api/UserService.Api.csproj UserService.Api/
COPY UserService.Application/UserService.Application.csproj UserService.Application/
COPY UserService.Infrastructure/UserService.Infrastructure.csproj UserService.Infrastructure/
COPY UserService.Domain/UserService.Domain.csproj UserService.Domain/
COPY SharedLibrary/SharedLibrary.csproj SharedLibrary/
COPY SharedKernel/SharedKernel.csproj   SharedKernel/

RUN dotnet restore UserService.Api/UserService.Api.csproj

# copy toàn bộ source và publish
COPY . .
RUN dotnet publish UserService.Api/UserService.Api.csproj -c Release -o /out

# STAGE 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /out .
ENTRYPOINT ["dotnet","UserService.Api.dll"]
