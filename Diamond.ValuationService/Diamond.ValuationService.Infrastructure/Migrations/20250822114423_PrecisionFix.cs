using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Diamond.ValuationService.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PrecisionFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ValuationRequests_DiamondSpec_SpecId",
                table: "ValuationRequests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DiamondSpec",
                table: "DiamondSpec");

            migrationBuilder.RenameTable(
                name: "DiamondSpec",
                newName: "DiamondSpecs");

            migrationBuilder.AlterColumn<decimal>(
                name: "CaratTo",
                table: "PriceTable",
                type: "decimal(6,3)",
                precision: 6,
                scale: 3,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "CaratFrom",
                table: "PriceTable",
                type: "decimal(6,3)",
                precision: 6,
                scale: 3,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "TablePercent",
                table: "DiamondSpecs",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "DepthPercent",
                table: "DiamondSpecs",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Carat",
                table: "DiamondSpecs",
                type: "decimal(6,3)",
                precision: 6,
                scale: 3,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DiamondSpecs",
                table: "DiamondSpecs",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ValuationRequests_DiamondSpecs_SpecId",
                table: "ValuationRequests",
                column: "SpecId",
                principalTable: "DiamondSpecs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ValuationRequests_DiamondSpecs_SpecId",
                table: "ValuationRequests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DiamondSpecs",
                table: "DiamondSpecs");

            migrationBuilder.RenameTable(
                name: "DiamondSpecs",
                newName: "DiamondSpec");

            migrationBuilder.AlterColumn<decimal>(
                name: "CaratTo",
                table: "PriceTable",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(6,3)",
                oldPrecision: 6,
                oldScale: 3);

            migrationBuilder.AlterColumn<decimal>(
                name: "CaratFrom",
                table: "PriceTable",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(6,3)",
                oldPrecision: 6,
                oldScale: 3);

            migrationBuilder.AlterColumn<decimal>(
                name: "TablePercent",
                table: "DiamondSpec",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldPrecision: 5,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "DepthPercent",
                table: "DiamondSpec",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldPrecision: 5,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Carat",
                table: "DiamondSpec",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(6,3)",
                oldPrecision: 6,
                oldScale: 3);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DiamondSpec",
                table: "DiamondSpec",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ValuationRequests_DiamondSpec_SpecId",
                table: "ValuationRequests",
                column: "SpecId",
                principalTable: "DiamondSpec",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
