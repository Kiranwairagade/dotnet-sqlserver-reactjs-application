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
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ensure 'Category' maps to the correct table name
            modelBuilder.Entity<Category>().ToTable("ProductCategories");

            

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
