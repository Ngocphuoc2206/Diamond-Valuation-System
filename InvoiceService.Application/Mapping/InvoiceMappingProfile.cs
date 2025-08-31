using AutoMapper;
using InvoiceService.Application.DTOs;
using InvoiceService.Domain.Entities;
using InvoiceService.Domain.ValueObjects;

namespace InvoiceService.Application.Mapping;

public class InvoiceMappingProfile : Profile
{
    public InvoiceMappingProfile()
    {
        CreateMap<DiamondDto, DiamondInfo>()
            .ConstructUsing(d => new DiamondInfo(d.ShapeCut, d.CaratWeight, d.ColorGrade, d.ClarityGrade, d.CutGrade));

        CreateMap<Receipt, ReceiptResponse>()
            .ForMember(d => d.Diamond, opt => opt.MapFrom(s =>
                new DiamondDto(s.Diamond.ShapeCut, s.Diamond.CaratWeight, s.Diamond.ColorGrade, s.Diamond.ClarityGrade, s.Diamond.CutGrade)));
    }
}
