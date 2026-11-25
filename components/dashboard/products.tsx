"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Search } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCategories } from "@/lib/categories";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import {
  Alert, Btn, ConfirmModal, Empty, Modal, PageHeader, Pill, Toast,
  field, panel, useAdminData, type Confirm,
} from "@/components/dashboard/ui";

type AdminProduct = Product & { stock: number; active: boolean };

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 150);

export function ProductsView() {
  const { can } = useAuth();
  const categories = useCategories();
  const products = useAdminData<AdminProduct>("/admin/products?limit=100");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminProduct | "new" | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);

  const term = search.trim().toLowerCase();
  const list = products.data.filter((p) => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(term));
  const current = editing && editing !== "new" ? editing : null;

  function show(next: AdminProduct | "new") {
    products.clearError();
    setEditing(next);
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    const body = {
      name: text("name"),
      brand: text("brand"),
      category: text("category"),
      price: Number(text("price")),
      compareAt: text("compareAt") ? Number(text("compareAt")) : null,
      stock: Number(text("stock")),
      image: text("image") || null,
      featured: data.has("featured"),
      description_en: text("description_en"),
      description_bn: text("description_bn"),
    };
    const ok = current
      ? await products.run(`/admin/products/${current.id}`, "PATCH", body, "Product updated")
      : await products.run(
          "/admin/products",
          "POST",
          { ...body, slug: text("slug") || slugify(body.name) },
          "Product created"
        );
    if (ok) setEditing(null);
  }

  const input = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block text-sm font-medium">
      {label}
      <input name={name} className={`${field} mt-1.5`} {...props} />
    </label>
  );

  return (
    <>
      <PageHeader title="Products" text={`${products.data.length} products`}>
        {can("products.create") && (
          <Btn onClick={() => show("new")}>
            <Plus className="size-4" /> Add product
          </Btn>
        )}
      </PageHeader>
      {!editing && <Alert error={products.error} />}

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3.5 top-3.5 size-4 text-foreground/40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" aria-label="Search products" className={`${field} pl-10`} />
      </div>

      <section className={`${panel} divide-y divide-black/5`}>
        {!list.length && <Empty loading={products.loading}>No products found.</Empty>}
        {list.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-4 p-4">
            <div className="relative size-14 overflow-hidden rounded-xl bg-black/5">
              {/* Only local images go through next/image: other hosts need next.config. */}
              {p.image?.startsWith("/") && <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />}
            </div>
            <div className="min-w-48 flex-1">
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="text-xs text-foreground/50">{p.brand} · {p.category}</p>
            </div>
            <span className="font-semibold">{formatPrice(p.price)}</span>
            <Pill tone={p.stock === 0 ? "red" : p.stock <= 5 ? "amber" : "green"}>Stock {p.stock}</Pill>
            {!p.active && <Pill tone="red">hidden</Pill>}
            <div className="flex gap-2">
              {can("products.update") && <Btn small variant="outline" onClick={() => show(p)}>Edit</Btn>}
              {p.active && can("products.delete") && (
                <Btn
                  small
                  variant="danger"
                  onClick={() =>
                    setConfirm({
                      title: "Hide product?",
                      text: `"${p.name}" will disappear from the store. Old orders keep it.`,
                      action: "Hide",
                      danger: true,
                      run: () => products.run(`/admin/products/${p.id}`, "DELETE", undefined, "Product hidden"),
                    })
                  }
                >
                  Hide
                </Btn>
              )}
              {!p.active && can("products.delete") && can("products.update") && (
                <Btn small onClick={() => products.run(`/admin/products/${p.id}`, "PATCH", { active: true }, "Product restored")}>
                  Restore
                </Btn>
              )}
            </div>
          </div>
        ))}
      </section>

      {editing && (
        <Modal wide title={current ? "Edit product" : "Add product"} onClose={() => setEditing(null)}>
          <Alert error={products.error} />
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">{input("name", "Name", { required: true, defaultValue: current?.name })}</div>
            {!current && (
              <div className="sm:col-span-2">
                {input("slug", "URL slug (optional; required if the name is not in English)", { pattern: "[a-z0-9]+(-[a-z0-9]+)*" })}
              </div>
            )}
            {input("brand", "Brand", { required: true, defaultValue: current?.brand })}
            {input("category", "Category", { required: true, defaultValue: current?.category, list: "categories" })}
            <datalist id="categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            {input("price", "Price (৳)", { required: true, type: "number", min: 0, step: "0.01", defaultValue: current?.price })}
            {input("compareAt", "Old price (optional)", { type: "number", min: 0, step: "0.01", defaultValue: current?.compareAt })}
            {input("stock", "Stock", { required: true, type: "number", min: 0, defaultValue: current?.stock ?? 0 })}
            {input("image", "Image path (e.g. /images/products/1.jpg)", { defaultValue: current?.image })}
            {(["description_en", "description_bn"] as const).map((name) => (
              <label key={name} className="block text-sm font-medium sm:col-span-2">
                {name === "description_en" ? "Description (English)" : "Description (বাংলা)"}
                <textarea name={name} required rows={3} defaultValue={current?.[name]} className={`${field} mt-1.5 h-auto py-2.5`} />
              </label>
            ))}
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="featured" defaultChecked={current?.featured} className="size-4" />
              Show in featured products
            </label>
            <div className="flex justify-end gap-3 sm:col-span-2">
              <Btn variant="outline" onClick={() => setEditing(null)}>Cancel</Btn>
              <Btn type="submit" busy={products.busy}>{current ? "Save changes" : "Create product"}</Btn>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmModal confirm={confirm} onClose={() => setConfirm(null)} />
      <Toast message={products.message} onDone={products.clearMessage} />
    </>
  );
}
