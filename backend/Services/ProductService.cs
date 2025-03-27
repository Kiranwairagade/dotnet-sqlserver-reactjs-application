using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ECommerceAPI.Data;
using ECommerceAPI.DTOs;
using ECommerceAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Services
{
    public interface IProductService
    {
        Task<ProductsResponse> GetProductsAsync(int pageNumber, int pageSize, int? categoryId, string? searchTerm);
        Task<ProductDetailDto> GetProductByIdAsync(int id);
        Task<int> CreateProductAsync(CreateProductRequest request, int userId);
        Task<bool> UpdateProductAsync(int id, UpdateProductRequest request);
        Task<bool> DeleteProductAsync(int id);
    }

    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ProductsResponse> GetProductsAsync(int pageNumber, int pageSize, int? categoryId, string? searchTerm)
        {
            var query = _context.Products.AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId);
            }

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(p => p.ProductName.Contains(searchTerm) || p.Description.Contains(searchTerm));
            }

            var products = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductListDto
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    SKU = p.SKU,
                    Price = p.Price,
                    DiscountPrice = p.DiscountPrice,
                    Quantity = p.Quantity,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category!.CategoryName, // Use null-forgiving operator
                    PrimaryImageUrl = p.Images.FirstOrDefault(pi => pi.IsPrimary)!.ImageUrl // Use null-forgiving operator
                })
                .ToListAsync();

            var totalCount = await query.CountAsync();

            return new ProductsResponse
            {
                Products = products,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<ProductDetailDto> GetProductByIdAsync(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.CreatedByUser)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null)
            {
                throw new KeyNotFoundException("Product not found.");
            }

            return new ProductDetailDto
            {
                ProductId = product.ProductId,
                ProductName = product.ProductName,
                Description = product.Description,
                SKU = product.SKU,
                Price = product.Price,
                DiscountPrice = product.DiscountPrice,
                Quantity = product.Quantity,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.CategoryName ?? string.Empty, // Use null-conditional operator
                CreatedByUserId = product.CreatedByUserId,
                CreatedByUsername = product.CreatedByUser?.Username ?? string.Empty, // Use null-conditional operator
                Images = product.Images.Select(pi => new ProductImageDto
                {
                    ImageId = pi.ImageId,
                    ImageUrl = pi.ImageUrl,
                    IsPrimary = pi.IsPrimary
                }).ToList()
            };
        }

        public async Task<int> CreateProductAsync(CreateProductRequest request, int userId)
        {
            var product = new Product
            {
                ProductName = request.ProductName,
                Description = request.Description,
                SKU = request.SKU,
                Price = request.Price,
                DiscountPrice = request.DiscountPrice,
                Quantity = request.Quantity,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CategoryId = request.CategoryId,
                CreatedByUserId = userId,
                Images = request.Images.Select(pi => new ProductImage
                {
                    ImageUrl = pi.ImageUrl,
                    IsPrimary = pi.IsPrimary
                }).ToList()
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return product.ProductId;
        }

        public async Task<bool> UpdateProductAsync(int id, UpdateProductRequest request)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null)
            {
                throw new KeyNotFoundException("Product not found.");
            }

            product.ProductName = request.ProductName;
            product.Description = request.Description;
            product.SKU = request.SKU;
            product.Price = request.Price;
            product.DiscountPrice = request.DiscountPrice;
            product.Quantity = request.Quantity;
            product.IsActive = request.IsActive;
            product.UpdatedAt = DateTime.UtcNow;
            product.CategoryId = request.CategoryId;

            // Update images
            product.Images = request.Images.Select(pi => new ProductImage
            {
                ImageUrl = pi.ImageUrl,
                IsPrimary = pi.IsPrimary
            }).ToList();

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                throw new KeyNotFoundException("Product not found.");
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}