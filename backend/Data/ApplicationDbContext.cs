using Microsoft.EntityFrameworkCore;
using backend.Models;
using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSet properties for your entities
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<ProductImage> ProductImages { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ensure 'Category' maps to the correct table name
            modelBuilder.Entity<Category>().ToTable("ProductCategories");

            // ProductImage Entity Configuration
            modelBuilder.Entity<ProductImage>()
                .HasKey(pi => pi.ImageId); // Define primary key

            modelBuilder.Entity<ProductImage>()
                .HasOne(pi => pi.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Permissions as a comma-separated string in the database
            modelBuilder.Entity<User>()
                .Property(u => u.Permissions)
                .HasConversion(
                    v => string.Join(',', v), // Convert List<string> to string
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() // Convert string back to List<string>
                );
            var stringListConverter = new ValueConverter<List<string>, string>(
    v => string.Join(",", v),     // Convert List<string> to comma-separated string
    v => v.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).ToList() // Back to List<string>
);

            modelBuilder.Entity<User>()
                .Property(u => u.Permissions)
                .HasConversion(stringListConverter);

        }
        public DbSet<UserPermission> UserPermissions { get; set; }     
    }
}
