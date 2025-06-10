using Microsoft.EntityFrameworkCore;
using StoryMapApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Configure the port
builder.WebHost.UseUrls("http://localhost:5000");

// Add database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services
builder.Services.AddScoped<DataMigrationService>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:3000") // React dev server URL
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowReactApp"); // Use the policy

app.MapControllers();

app.Run();
