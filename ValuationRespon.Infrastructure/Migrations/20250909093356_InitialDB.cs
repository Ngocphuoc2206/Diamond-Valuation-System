using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValuationRespon.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ValuationCases",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    CertificateNo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Origin = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Shape = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Carat = table.Column<double>(type: "float", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Clarity = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Cut = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Polish = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Symmetry = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Fluorescence = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    Status = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false, defaultValue: "Pending"),
                    AssigneeId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AssigneeName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValuationCases", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ValuationResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ValuationCaseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MarketValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    InsuranceValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RetailValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Condition = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false, defaultValue: ""),
                    Certification = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false, defaultValue: ""),
                    Notes = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    CaseId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValuationResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ValuationResults_ValuationCases_CaseId",
                        column: x => x.CaseId,
                        principalTable: "ValuationCases",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ValuationResults_ValuationCases_ValuationCaseId",
                        column: x => x.ValuationCaseId,
                        principalTable: "ValuationCases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ValuationTimelines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ValuationCaseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Step = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Note = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false, defaultValue: ""),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValuationTimelines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ValuationTimelines_ValuationCases_ValuationCaseId",
                        column: x => x.ValuationCaseId,
                        principalTable: "ValuationCases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ValuationCases_AssigneeId",
                table: "ValuationCases",
                column: "AssigneeId");

            migrationBuilder.CreateIndex(
                name: "IX_ValuationCases_CreatedAt",
                table: "ValuationCases",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ValuationCases_Status",
                table: "ValuationCases",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_ValuationResults_CaseId",
                table: "ValuationResults",
                column: "CaseId");

            migrationBuilder.CreateIndex(
                name: "IX_ValuationResults_ValuationCaseId",
                table: "ValuationResults",
                column: "ValuationCaseId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ValuationTimelines_ValuationCaseId_Timestamp",
                table: "ValuationTimelines",
                columns: new[] { "ValuationCaseId", "Timestamp" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ValuationResults");

            migrationBuilder.DropTable(
                name: "ValuationTimelines");

            migrationBuilder.DropTable(
                name: "ValuationCases");
        }
    }
}
