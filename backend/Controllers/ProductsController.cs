using System.Threading.Tasks;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<ProductsResponse>> GetProducts(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? categoryId = null,
            [FromQuery] string? searchTerm = null)
        {
            var response = await _productService.GetProductsAsync(pageNumber, pageSize, categoryId, searchTerm);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDetailDto>> GetProductById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            return Ok(product);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreateProduct([FromBody] CreateProductRequest request)
        {
            // Check if user has permission to create products
            if (!User.HasClaim(c => c.Type == "Permission" && c.Value == "CreateProduct"))
            {
                return Forbid();
            }

            // Safely parse the user ID
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                return BadRequest(new { message = "Invalid user ID." });
            }

            var productId = await _productService.CreateProductAsync(request, userId);
            return CreatedAtAction(nameof(GetProductById), new { id = productId }, productId);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduct(int id, [FromBody] UpdateProductRequest request)
        {
            // Check if user has permission to update products
            if (!User.HasClaim(c => c.Type == "Permission" && c.Value == "UpdateProduct"))
            {
                return Forbid();
            }

            var success = await _productService.UpdateProductAsync(id, request);

            if (!success)
            {
                return NotFound(new { message = "Product not found" });
            }

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            // Check if user has permission to delete products
            if (!User.HasClaim(c => c.Type == "Permission" && c.Value == "DeleteProduct"))
            {
                return Forbid();
            }

            var success = await _productService.DeleteProductAsync(id);

            if (!success)
            {
                return NotFound(new { message = "Product not found" });
            }

            return NoContent();
        }
    }
}