export type CanonicalRole =
  | "guest"
  | "customer"
  | "consultingstaff"
  | "valuationstaff"
  | "manager"
  | "admin";

/** Chuẩn hóa 1 role string bất kỳ về canonical (không dấu, không gạch, lowercase). */
export function normalizeRole(role?: string): CanonicalRole {
  if (!role) return "guest";

  // Loại bỏ ký tự không phải a-z, hạ lowercase, bỏ khoảng/underscore/dash
  const r = role
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  if (r.includes("admin")) return "admin";
  if (r.includes("manager")) return "manager";
  if (r.includes("valuationstaff") || r.includes("valuation"))
    return "valuationstaff";
  if (r.includes("consultingstaff") || r.includes("consult"))
    return "consultingstaff";
  if (r.includes("customer")) return "customer";
  if (r.includes("guest")) return "guest";

  // Mặc định
  return "guest";
}

export function pickUserRole(
  roles?: Array<{ name?: string }> | string,
  fallback: CanonicalRole = "customer"
): CanonicalRole {
  if (!roles) return fallback;

  if (typeof roles === "string") return normalizeRole(roles);

  const normalized = roles.map((r) => normalizeRole(r?.name ?? ""));
  const priority: CanonicalRole[] = [
    "admin",
    "manager",
    "valuationstaff",
    "consultingstaff",
    "customer",
    "guest",
  ];

  for (const want of priority) if (normalized.includes(want)) return want;
  return fallback;
}

export const roleLabel: Record<CanonicalRole, string> = {
  guest: "Guest",
  customer: "Customer",
  consultingstaff: "Consulting Staff",
  valuationstaff: "Valuation Staff",
  manager: "Manager",
  admin: "Admin",
};

export function toBackendRole(canonical: CanonicalRole): string {
  switch (canonical) {
    case "consultingstaff":
      return "ConsultingStaff";
    case "valuationstaff":
      return "ValuationStaff";
    case "customer":
      return "Customer";
    case "manager":
      return "Manager";
    case "admin":
      return "Admin";
    case "guest":
    default:
      return "Guest";
  }
}
