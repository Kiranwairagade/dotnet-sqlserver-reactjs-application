using System;

    namespace backend.Models
    {
        public class Supplier
        {
            public int SupplierId { get; set; }
            public string? Name { get; set; }  
            public string? Email { get; set; } 
            public string? Phone { get; set; }
            public string? Address { get; set; } 
            public DateTime CreatedAt { get; set; }
            public DateTime UpdatedAt { get; set; }
        }
    }


