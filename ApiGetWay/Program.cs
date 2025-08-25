using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// YARP: tải config từ appsettings
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// CORS cho FE
var allowed = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
              ?? new[] { "http://localhost:5173", "http://localhost:3000" };
builder.Services.AddCors(o => o.AddPolicy("AllowFE",
    p => p.WithOrigins(allowed).AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

builder.Services.AddHealthChecks();

var app = builder.Build();

// Proxy phía trước/compose/nginx
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseCors("AllowFE");

app.MapGet("/", () => Results.Ok(new { service = "ApiGateway", ok = true }));
app.MapHealthChecks("/healthz");

app.MapReverseProxy();

app.Run();
