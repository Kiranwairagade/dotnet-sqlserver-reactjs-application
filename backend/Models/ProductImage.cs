using System.ComponentModel.DataAnnotations;

namespace ECommerceAPI.Models
{
    public class ProductImage
    {
        [Key] // Add this attribute to define the primary key
        public int ImageId { get; set; }

        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
        public int ProductId { get; set; }

        // Navigation property
        public Product Product { get; set; } = null!;
    }
}