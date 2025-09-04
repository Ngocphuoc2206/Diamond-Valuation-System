using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Catalog.Infrastructure.Db.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDecimalTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Cut_Value",
                table: "Products",
                newName: "Shape");

            migrationBuilder.RenameColumn(
                name: "Color_Value",
                table: "Products",
                newName: "Cut");

            migrationBuilder.RenameColumn(
                name: "Clarity_Value",
                table: "Products",
                newName: "Color");

            migrationBuilder.RenameColumn(
                name: "Carat_Value",
                table: "Products",
                newName: "Carat");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AddColumn<string>(
                name: "Clarity",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Clarity",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "Shape",
                table: "Products",
                newName: "Cut_Value");

            migrationBuilder.RenameColumn(
                name: "Cut",
                table: "Products",
                newName: "Color_Value");

            migrationBuilder.RenameColumn(
                name: "Color",
                table: "Products",
                newName: "Clarity_Value");

            migrationBuilder.RenameColumn(
                name: "Carat",
                table: "Products",
                newName: "Carat_Value");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Products",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
