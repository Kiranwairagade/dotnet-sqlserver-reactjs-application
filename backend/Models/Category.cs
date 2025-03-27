using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ECommerceAPI.Models
{
    public class Category
    {
        [Key] // Add this attribute to define the primary key
        public int CategoryId { get; set; }

        public string CategoryName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation property
        public List<Product> Products { get; set; } = new List<Product>();
    }
}