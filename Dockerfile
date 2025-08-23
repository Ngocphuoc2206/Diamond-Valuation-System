# STAGE 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
EXPOSE 8080

# copy csproj để restore
COPY Payment.Api/Payment.Api.csproj Payment.Api/
COPY Payment.Application/Payment.Application.csproj Payment.Application/
COPY Payment.Infrastructure/Payment.Infrastructure.csproj Payment.Infrastructure/
COPY Payment.Domain/Payment.Domain.csproj Payment.Domain/
COPY SharedLibrary/SharedLibrary.csproj SharedLibrary/
COPY SharedKernel/SharedKernel.csproj   SharedKernel/

RUN dotnet restore Payment.Api/Payment.Api.csproj

# copy toàn bộ source và publish
COPY . .
RUN dotnet publish Payment.Api/Payment.Api.csproj -c Release -o /out

# STAGE 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /out .
ENTRYPOINT ["dotnet","Payment.Api.dll"]
