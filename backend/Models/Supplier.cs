using System;

    namespace backend.Models
    {
        public class Supplier
        {
            public int SupplierId { get; set; }
            public string? Name { get; set; }  // Changed from SupplierName to Name
            public string? Email { get; set; } // Ensure Email property is defined here
            public string? Phone { get; set; }
            public string? Address { get; set; } // Optional, if you want to use it
            public DateTime CreatedAt { get; set; }
            public DateTime UpdatedAt { get; set; }
        }
    }


