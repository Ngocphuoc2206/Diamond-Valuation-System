# Diamond Product Service (Clean Architecture)

A .NET 8 Web API microservice for Diamond Valuation System focusing on:
- Diamond product catalog and attributes
- Price sources & price snapshots (sync stubs)
- Certificate/inspection lookup
- Estimation API to estimate a diamond's value by criteria or certificate code

Structure mirrors Clean Architecture:
- Product.Domain
- Product.Application
- Product.Infrastructure
- Product.Api

> This scaffold is self-contained and uses EF Core + SQLite for quick start.
