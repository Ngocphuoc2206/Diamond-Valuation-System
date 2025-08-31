using FluentValidation;
using InvoiceService.Application.DTOs;

namespace InvoiceService.Application.Validation;

public class CreateReceiptRequestValidator : AbstractValidator<CreateReceiptRequest>
{
    public CreateReceiptRequestValidator()
    {
        RuleFor(x => x.ReceiptDate).NotEmpty();
        RuleFor(x => x.AppraiserId).NotEmpty();
        RuleFor(x => x.EstimatedValue).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Diamond).NotNull();
        RuleFor(x => x.Diamond.ShapeCut).NotEmpty();
        RuleFor(x => x.Diamond.CaratWeight).GreaterThan(0);
        RuleFor(x => x.Diamond.ColorGrade).Must(BeValidColor).When(x => x.Diamond.ColorGrade is not null);
        RuleFor(x => x.Diamond.ClarityGrade).Must(BeValidClarity).When(x => x.Diamond.ClarityGrade is not null);
        RuleFor(x => x.Diamond.CutGrade).Must(BeValidCut).When(x => x.Diamond.CutGrade is not null);
    }

    static bool BeValidColor(string? c) => new[] { "D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z" }.Contains(c!.ToUpper());
    static bool BeValidClarity(string? s) => new[] { "FL","IF","VVS1","VVS2","VS1","VS2","SI1","SI2","I1","I2","I3" }.Contains(s!.ToUpper());
    static bool BeValidCut(string? s) => new[] { "EXCELLENT","VERY GOOD","GOOD","FAIR","POOR" }.Contains(s!.ToUpper());
}
