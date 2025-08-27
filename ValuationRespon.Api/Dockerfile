# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# copy csproj files
COPY ["ValuationRespon.Api/ValuationRespon.Api.csproj", "ValuationRespon.Api/"]
COPY ["ValuationRespon.Application/ValuationRespon.Application.csproj", "ValuationRespon.Application/"]
COPY ["ValuationRespon.Domain/ValuationRespon.Domain.csproj", "ValuationRespon.Domain/"]
COPY ["ValuationRespon.Infrastructure/ValuationRespon.Infrastructure.csproj", "ValuationRespon.Infrastructure/"]

RUN dotnet restore "ValuationRespon.Api/ValuationRespon.Api.csproj"

# copy toàn bộ solution
COPY . .
WORKDIR "/src/ValuationRespon.Api"

# build + publish
RUN dotnet build "ValuationRespon.Api.csproj" -c Release -o /app/build
RUN dotnet publish "ValuationRespon.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ValuationRespon.Api.dll"]
