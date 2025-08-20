using Reporting.Domain.Model;

namespace Reporting.Infrastructure.Persistence
{
    public static class DbSeeder
    {
        public static async Task Seed(AppDbContext context)
        {
            // DashboardStat
            if (!context.DashboardStats.Any())
            {
                context.DashboardStats.Add(new DashboardStat
                {
                    TotalUsers = 1247,
                    TotalValuations = 892,
                    PendingValuations = 34,
                    TotalRevenue = 2456789,
                    MonthlyRevenue = 234567,
                    CompletedOrders = 156,
                    PendingOrders = 23,
                    CustomerRating = 4.8,
                    AvgTurnaroundTime = 4.2
                });
            }

            // Orders
            if (!context.Orders.Any())
            {
                context.Orders.AddRange(
                    new Order
                    {
                        Customer = "Jane Smith",
                        Items = 2,
                        Total = 3450,
                        Status = "delivered",
                        Date = DateTime.Parse("2024-01-15"),
                        Email = "jane.smith@email.com"
                    },
                    new Order
                    {
                        Customer = "Michael Johnson",
                        Items = 1,
                        Total = 15999,
                        Status = "shipped",
                        Date = DateTime.Parse("2024-01-14"),
                        Email = "michael.j@email.com"
                    },
                    new Order
                    {
                        Customer = "Sarah Williams",
                        Items = 3,
                        Total = 8750,
                        Status = "processing",
                        Date = DateTime.Parse("2024-01-13"),
                        Email = "sarah.w@email.com"
                    }
                );
            }

            // Products
            if (!context.Products.Any())
            {
                context.Products.AddRange(
                    new Product
                    {
                        Name = "Classic Solitaire Ring",
                        Description = "2.5ct Round Brilliant",
                        Sku = "RING-2024-001",
                        Category = "Engagement Rings",
                        Price = 15999,
                        Stock = 5,
                        Status = "active",
                        Image = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=40&h=40&fit=crop"
                    },
                    new Product
                    {
                        Name = "Diamond Tennis Necklace",
                        Description = "5ct Total Weight",
                        Sku = "NECK-2024-002",
                        Category = "Necklaces",
                        Price = 12500,
                        Stock = 3,
                        Status = "active",
                        Image = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=40&h=40&fit=crop"
                    }
                );
            }

            // Valuations
            if (!context.Valuations.Any())
            {
                context.Valuations.AddRange(
                    new Valuation
                    {
                        Customer = "John Doe",
                        Type = "Insurance Appraisal",
                        Status = "in_progress",
                        AssignedTo = "Dr. Emma Wilson",
                        DueDate = DateTime.Parse("2024-01-20"),
                        Priority = "normal"
                    },
                    new Valuation
                    {
                        Customer = "Lisa Chen",
                        Type = "Market Valuation",
                        Status = "pending",
                        AssignedTo = "James Rodriguez",
                        DueDate = DateTime.Parse("2024-01-22"),
                        Priority = "high"
                    }
                );
            }

            // Staff
            if (!context.Staffs.Any())
            {
                context.Staffs.AddRange(
                    new Staff
                    {
                        Name = "Dr. Emma Wilson",
                        Email = "emma.wilson@company.com",
                        Role = "valuation_staff",
                        Department = "Appraisal",
                        ActiveCases = 8,
                        Performance = 98.5,
                        Status = "active",
                        Avatar = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=32&h=32&fit=crop&crop=face"
                    },
                    new Staff
                    {
                        Name = "James Rodriguez",
                        Email = "james.rodriguez@company.com",
                        Role = "consulting_staff",
                        Department = "Consultation",
                        ActiveCases = 12,
                        Performance = 95.2,
                        Status = "active",
                        Avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
                    }
                );
            }

            // Activities
            if (!context.Activities.Any())
            {
                context.Activities.AddRange(
                    new Activity
                    {
                        Type = "valuation",
                        Message = "New valuation request submitted by John Doe",
                        Time = "10 minutes ago",
                        Priority = "high"
                    },
                    new Activity
                    {
                        Type = "order",
                        Message = "Order #ORD-2024-0156 completed and shipped",
                        Time = "25 minutes ago",
                        Priority = "normal"
                    },
                    new Activity
                    {
                        Type = "user",
                        Message = "New customer registration: jane.smith@email.com",
                        Time = "1 hour ago",
                        Priority = "low"
                    },
                    new Activity
                    {
                        Type = "staff",
                        Message = "Valuation staff Sarah completed 3 appraisals",
                        Time = "2 hours ago",
                        Priority = "normal"
                    },
                    new Activity
                    {
                        Type = "system",
                        Message = "Pricing data synchronized from external API",
                        Time = "3 hours ago",
                        Priority = "low"
                    }
                );
            }

            context.SaveChanges();
        }
    }
}