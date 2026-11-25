export type Permission = {
  key: string;
  description: string;
  system: boolean;
  roles: string[];
};

// Grouped by the part before the first dot: products.*, orders.*, ...
export function groupPermissions(list: Permission[]) {
  const groups: Record<string, Permission[]> = {};
  for (const p of list) (groups[p.key.split(".")[0]] ??= []).push(p);
  return Object.entries(groups);
}
