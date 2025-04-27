using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class CreateFAQsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FAQs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Question = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Answer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Keywords = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FAQs", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "FAQs",
                columns: new[] { "Id", "Answer", "CreatedAt", "IsActive", "Keywords", "Question", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "We offer a 30-day return policy on all items. Items must be in their original condition with tags attached.", new DateTime(2025, 4, 22, 16, 31, 51, 880, DateTimeKind.Utc).AddTicks(9357), true, "return refund policy", "What is your return policy?", null },
                    { 2, "You can track your order by logging into your account and going to 'Order History'. You can also use the tracking number sent in your shipping confirmation email.", new DateTime(2025, 4, 22, 16, 31, 51, 881, DateTimeKind.Utc).AddTicks(143), true, "track order shipping delivery", "How do I track my order?", null },
                    { 3, "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can see shipping options during checkout.", new DateTime(2025, 4, 22, 16, 31, 51, 881, DateTimeKind.Utc).AddTicks(145), true, "international shipping worldwide global", "Do you ship internationally?", null },
                    { 4, "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.", new DateTime(2025, 4, 22, 16, 31, 51, 881, DateTimeKind.Utc).AddTicks(147), true, "payment credit card paypal", "What payment methods do you accept?", null },
                    { 5, "You can reach our customer support team by email at support@example.com or by phone at 1-800-123-4567 between 9 AM and 6 PM EST Monday through Friday.", new DateTime(2025, 4, 22, 16, 31, 51, 881, DateTimeKind.Utc).AddTicks(148), true, "contact support help customer service", "How can I contact customer support?", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FAQs");
        }
    }
}
