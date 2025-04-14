using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using System;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuppliersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SuppliersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/suppliers
        [HttpGet]
        public IActionResult GetAllSuppliers()
        {
            var suppliers = _context.Suppliers
                .Select(s => new
                {
                    s.SupplierId,
                    s.Name,
                    s.Email,
                    s.Phone,
                    s.Address,
                    s.CreatedAt,
                    s.UpdatedAt
                })
                .ToList();

            return Ok(suppliers);
        }

        // GET: api/suppliers/{id}
        [HttpGet("{id}")]
        public IActionResult GetSupplierById(int id)
        {
            var supplier = _context.Suppliers.FirstOrDefault(s => s.SupplierId == id);

            if (supplier == null)
                return NotFound("Supplier not found.");

            return Ok(supplier);
        }

        // POST: api/suppliers
        [HttpPost]
        public IActionResult AddSupplier([FromBody] Supplier supplier)
        {
            if (string.IsNullOrWhiteSpace(supplier.Name))
                return BadRequest("Supplier name is required.");

            supplier.CreatedAt = DateTime.UtcNow;
            supplier.UpdatedAt = DateTime.UtcNow;

            _context.Suppliers.Add(supplier);
            _context.SaveChanges();

            return Ok(supplier);
        }

        // PUT: api/suppliers/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateSupplier(int id, [FromBody] Supplier updatedSupplier)
        {
            var supplier = _context.Suppliers.FirstOrDefault(s => s.SupplierId == id);
            if (supplier == null)
                return NotFound("Supplier not found.");

            if (string.IsNullOrWhiteSpace(updatedSupplier.Name))
                return BadRequest("Supplier name is required.");

            supplier.Name = updatedSupplier.Name;
            supplier.Email = updatedSupplier.Email;
            supplier.Phone = updatedSupplier.Phone;
            supplier.Address = updatedSupplier.Address;
            supplier.UpdatedAt = DateTime.UtcNow;

            _context.SaveChanges();

            return Ok(supplier);
        }

        // DELETE: api/suppliers/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteSupplier(int id)
        {
            var supplier = _context.Suppliers.FirstOrDefault(s => s.SupplierId == id);
            if (supplier == null)
                return NotFound("Supplier not found.");

            _context.Suppliers.Remove(supplier);
            _context.SaveChanges();

            return Ok("Supplier deleted successfully");
        }
    }
}
