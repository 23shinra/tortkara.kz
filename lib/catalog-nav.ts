import type { EquipmentCategory, RigConditionGroup } from "@/lib/products-meta";

export type CatalogRigGroup = RigConditionGroup;
export type CatalogEquipmentType = Extract<
  EquipmentCategory,
  "kelly-bars" | "casing-oscillators" | "drilling-tools"
>;

export function catalogRigsHref(group?: CatalogRigGroup) {
  return group ? `/catalog?group=${group}` : "/catalog";
}

export function catalogEquipmentHref(type?: CatalogEquipmentType) {
  return type ? `/catalog/equipment?type=${type}` : "/catalog/equipment";
}

export function parseRigGroup(value?: string | null): CatalogRigGroup | undefined {
  return value === "new" || value === "used" ? value : undefined;
}

export function parseEquipmentType(value?: string | null): CatalogEquipmentType | undefined {
  return value === "kelly-bars" || value === "casing-oscillators" || value === "drilling-tools"
    ? value
    : undefined;
}

export function isRigsCatalogPath(path: string) {
  if (path === "/catalog") return true;
  if (path.startsWith("/catalog/equipment")) return false;
  return path.startsWith("/catalog/");
}

export function isEquipmentCatalogPath(path: string) {
  return path === "/catalog/equipment" || path.startsWith("/catalog/equipment/");
}
