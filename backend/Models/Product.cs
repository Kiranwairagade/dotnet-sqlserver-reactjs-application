using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ECommerceAPI.Models
{
    public class Product
    {
        [Key] // Add this attribute to define the primary key
        public int ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public int Quantity { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int? CategoryId { get; set; }
        public int CreatedByUserId { get; set; }

        // Navigation properties
        public Category Category { get; set; } = null!;
        public User CreatedByUser { get; set; } = null!;
        public List<ProductImage> Images { get; set; } = new List<ProductImage>();
    }
}