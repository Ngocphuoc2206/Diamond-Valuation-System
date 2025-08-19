using Microsoft.AspNetCore.Mvc;
using Diamond.ValuationService.Data;
using Diamond.ValuationService.Models;

namespace Diamond.ValuationService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ValuationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ValuationsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _context.DiamondSpecs.ToList();
            return Ok(data);
        }

        [HttpPost]
        public IActionResult Create([FromBody] DiamondSpec diamond)
        {
            _context.DiamondSpecs.Add(diamond);
            _context.SaveChanges();
            return Ok(diamond);
        }
    }
}
