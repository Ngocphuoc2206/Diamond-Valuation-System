using InvoiceService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace InvoiceService.Infrastructure.Data.Configurations;

public class ReceiptConfiguration : IEntityTypeConfiguration<Receipt>
{
    public void Configure(EntityTypeBuilder<Receipt> b)
    {
        b.ToTable("Receipts");
        b.HasKey(x => x.Id);
        b.HasIndex(x => x.ReceiptNo).IsUnique();
        b.Property(x => x.ReceiptNo).IsRequired().HasMaxLength(32);
        b.Property(x => x.ReceiptDate).HasConversion(
            v => v.ToDateTime(TimeOnly.MinValue), 
            v => DateOnly.FromDateTime(v));
        b.Property(x => x.EstimatedValue).HasColumnType("decimal(18,2)");

        b.OwnsOne(x => x.Diamond, d =>
        {
            d.Property(p => p.ShapeCut).HasMaxLength(64).HasColumnName("Diamond_ShapeCut");
            d.Property(p => p.CaratWeight).HasColumnType("decimal(6,2)").HasColumnName("Diamond_Carat");
            d.Property(p => p.ColorGrade).HasMaxLength(8).HasColumnName("Diamond_Color");
            d.Property(p => p.ClarityGrade).HasMaxLength(8).HasColumnName("Diamond_Clarity");
            d.Property(p => p.CutGrade).HasMaxLength(16).HasColumnName("Diamond_CutGrade");
        });
    }
}
