using FluentValidation;
using InvoiceService.Application.DTOs;
using System;
using System.Linq;

namespace InvoiceService.Application.Validation;

public class CreateReceiptRequestValidator : AbstractValidator<CreateReceiptRequest>
{
    private static readonly string[] ColorGrades =
        new[] { "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" };

    private static readonly string[] ClarityGrades =
        new[] { "FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3" };

    private static readonly string[] CutGrades =
        new[] { "EXCELLENT", "VERY GOOD", "GOOD", "FAIR", "POOR", "VERYGOOD", "VeryGood" };

    public CreateReceiptRequestValidator()
    {
        // Dừng khi rule trước đó đã fail để tránh chạy rule có thể gây NRE
        RuleLevelCascadeMode = CascadeMode.Stop;

        RuleFor(x => x.ReceiptDate).NotEmpty();
        RuleFor(x => x.AppraiserId).NotEmpty();
        RuleFor(x => x.EstimatedValue).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Diamond).NotNull();

        // 1) Diamond phải có
        RuleFor(x => x.Diamond).NotNull().WithMessage("Diamond is required")
            // 2) Nếu có Diamond thì validate các trường con
            .DependentRules(() =>
            {
                RuleFor(x => x.Diamond!.ShapeCut)
                    .NotEmpty().WithMessage("Diamond.ShapeCut is required");

                RuleFor(x => x.Diamond!.CaratWeight)
                    .GreaterThan(0).WithMessage("Diamond.CaratWeight must be > 0");

                // Các trường tuỳ chọn: chỉ check khi không null/empty
                When(x => !string.IsNullOrWhiteSpace(x.Diamond!.ColorGrade), () =>
                {
                    RuleFor(x => x.Diamond!.ColorGrade!)
                        .Must(c => ColorGrades.Contains(c.Trim().ToUpperInvariant()))
                        .WithMessage("Diamond.ColorGrade must be D..Z");
                });

                When(x => !string.IsNullOrWhiteSpace(x.Diamond!.ClarityGrade), () =>
                {
                    RuleFor(x => x.Diamond!.ClarityGrade!)
                        .Must(s => ClarityGrades.Contains(s.Trim().ToUpperInvariant()))
                        .WithMessage("Diamond.ClarityGrade must be one of: FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3");
                });

                When(x => !string.IsNullOrWhiteSpace(x.Diamond!.CutGrade), () =>
                {
                    RuleFor(x => x.Diamond!.CutGrade!)
                        .Must(s => CutGrades.Contains(s.Trim().ToUpperInvariant()))
                        .WithMessage("Diamond.CutGrade must be one of: EXCELLENT, VERY GOOD, GOOD, FAIR, POOR");
                });
            });
    }
}
