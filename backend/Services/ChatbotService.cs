using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using backend.DTOs;

namespace backend.Services
{
    public class ChatbotService : IChatbotService
    {
        private readonly ApplicationDbContext _context;

        public ChatbotService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> ProcessMessageAsync(ChatRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return "Please enter a message.";
            }

            var message = request.Message.ToLower();

            if (message.Contains("supplier"))
            {
                return await GetSupplierInfoAsync(1); // static ID example
            }

            if (message.Contains("categories"))
            {
                var categories = await GetCategoriesAsync();
                if (categories.Count == 0) return "No categories found.";
                return string.Join("\n", categories.Select(c => $"Category: {c.CategoryName}, Products: {c.Products.Count}"));
            }

            if (message.Contains("brands"))
            {
                var brands = await GetBrandsAsync();
                if (brands.Count == 0) return "No brands found.";
                return string.Join("\n", brands.Select(b => $"Brand: {b.BrandName}, Created At: {b.CreatedAt.ToShortDateString()}"));
            }

            if (message.Contains("products by brand"))
            {
                var brandName = ExtractKeyword(message, "products by brand");
                if (string.IsNullOrEmpty(brandName)) return "Please specify a brand name.";
                var products = await GetProductsByBrandAsync(brandName);
                if (products.Count == 0) return $"No products found for brand '{brandName}'.";
                return string.Join("\n", products.Select(p => $"Product: {p.Name}, Price: {p.Price:C}"));
            }

            if (message.Contains("products by category"))
            {
                var categoryName = ExtractKeyword(message, "products by category");
                if (string.IsNullOrEmpty(categoryName)) return "Please specify a category name.";
                var products = await GetProductsByCategoryAsync(categoryName);
                if (products.Count == 0) return $"No products found in category '{categoryName}'.";
                return string.Join("\n", products.Select(p => $"Product: {p.Name}, Price: {p.Price:C}"));
            }

            return "Sorry, I didn't understand your request.";
        }

        private string ExtractKeyword(string message, string command)
        {
            var index = message.IndexOf(command);
            if (index == -1) return string.Empty;
            var keyword = message.Substring(index + command.Length).Trim();
            return keyword;
        }

        public async Task<string> GetSupplierInfoAsync(int supplierId)
        {
            var supplier = await _context.Suppliers.FindAsync(supplierId);
            if (supplier == null)
            {
                return "Supplier not found.";
            }

            return $"Supplier: {supplier.Name}, " +
                   $"Contact: {supplier.Email ?? "N/A"}, " +
                   $"Location: {supplier.Address ?? "N/A"}";
        }

        public async Task<List<Category>> GetCategoriesAsync()
        {
            return await _context.Categories
                .Include(c => c.Products)
                .ToListAsync();
        }

        public async Task<List<Brand>> GetBrandsAsync()
        {
            return await _context.Brands.ToListAsync();
        }

        public async Task<List<Product>> GetProductsByBrandAsync(string brandName)
        {
            var brand = await _context.Brands
                .FirstOrDefaultAsync(b => b.BrandName.ToLower() == brandName.ToLower());

            if (brand == null)
            {
                return new List<Product>();
            }

            // Assuming a foreign key relation exists between Product and Brand via BrandId (you can modify if needed)
            return await _context.Products
                .Where(p => EF.Property<int>(p, "BrandId") == brand.BrandId)
                .ToListAsync();
        }

        public async Task<List<Product>> GetProductsByCategoryAsync(string categoryName)
        {
            var category = await _context.Categories
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.CategoryName.ToLower() == categoryName.ToLower());

            return category?.Products?.ToList() ?? new List<Product>();
        }
    }
}
