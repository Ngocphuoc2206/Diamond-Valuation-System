using AutoMapper;
using InvoiceService.Application.DTOs;
using InvoiceService.Domain.Entities;
using InvoiceService.Domain.ValueObjects;

namespace InvoiceService.Application.Mapping;

public class InvoiceMappingProfile : Profile
{
    public InvoiceMappingProfile()
    {
        // Với request: DTO -> Value Object
        CreateMap<DiamondDto, DiamondInfo>()
            .ConstructUsing(d => new DiamondInfo(d.ShapeCut, d.CaratWeight, d.ColorGrade, d.ClarityGrade, d.CutGrade));

        // Với response: Value Object -> DTO (BỔ SUNG map này để không lỗi)
        CreateMap<DiamondInfo, DiamondDto>();

        // Entity -> Response DTO (GỘP về 1 map duy nhất)
        CreateMap<Receipt, ReceiptResponse>()
            .ForMember(d => d.ReceiptDate, m => m.MapFrom(s => s.ReceiptDate.ToString("yyyy-MM-dd")))
            // Diamond sẽ tự map qua map DiamondInfo -> DiamondDto ở trên
            .ForMember(d => d.Diamond, m => m.MapFrom(s => s.Diamond));

        // (tuỳ dùng) Request DTO -> Entity; nếu bạn đang khởi tạo entity thủ công có thể không cần
        CreateMap<CreateReceiptRequest, Receipt>()
            .ForMember(d => d.Diamond, m => m.MapFrom(s => s.Diamond));
    }
}
