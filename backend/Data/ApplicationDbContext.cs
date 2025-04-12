using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Linq;
using System.Collections.Generic;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSet properties for your entities
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<UserPermission> UserPermissions { get; set; } = null!;
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
                .HasKey(pi => pi.ImageId);

            modelBuilder.Entity<ProductImage>()
                .HasOne(pi => pi.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Permissions as a comma-separated string in the database
            modelBuilder.Entity<User>()
                .Property(u => u.Permissions)
                .HasConversion(
                    v => string.Join(',', v), // Convert List to string
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() // Convert string back to List
                );

            // Set up relationship between User and UserPermission
            modelBuilder.Entity<UserPermission>()
                .HasKey(up => new { up.UserId, up.ModuleName }); // Composite Key

            modelBuilder.Entity<UserPermission>()
                .HasOne(up => up.User)
                .WithMany(u => u.UserPermissions)
                .HasForeignKey(up => up.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
