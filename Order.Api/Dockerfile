# STAGE 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
EXPOSE 8080

# copy csproj để restore
COPY Order.Api/Order.Api.csproj Order.Api/
COPY Order.Application/Order.Application.csproj Order.Application/
COPY Order.Infrastructure/Order.Infrastructure.csproj Order.Infrastructure/
COPY Order.Domain/Order.Domain.csproj Order.Domain/
COPY SharedLibrary/SharedLibrary.csproj SharedLibrary/
COPY SharedKernel/SharedKernel.csproj   SharedKernel/

RUN dotnet restore Order.Api/Order.Api.csproj

# copy toàn bộ source và publish
COPY . .
RUN dotnet publish Order.Api/Order.Api.csproj -c Release -o /out

# STAGE 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /out .
ENTRYPOINT ["dotnet","Order.Api.dll"]
