import { defaultProducts, type Product } from '../data/products'

export type CartItem = { productId: string; variantId: string; quantity: number }
export type OrderStatus = 'new' | 'seen' | 'in_process' | 'shipped'
export type Order = {
  id: string; createdAt: string; status: OrderStatus; items: CartItem[]; total: number;
  customer: { name:string; phone:string; email:string; city:string; delivery:string; address:string; comment:string };
  payment: 'card'|'cod';
}

const k = (name:string) => `sixstudio:${name}`
export const read = <T,>(key:string, fallback:T):T => { try { const v=localStorage.getItem(k(key)); return v?JSON.parse(v):fallback } catch { return fallback } }
export const write = (key:string, value:unknown) => localStorage.setItem(k(key), JSON.stringify(value))
export const newId = (prefix='SIX') => `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`

// Preserve user-edited CMS data while hydrating newly introduced optional fields
// (for example image-per-size mapping) from the bundled product template.
export const normalizeProducts = (products:Product[]) => products.map(p=>{
  const template=defaultProducts.find(x=>x.id===p.id)
  return {
    ...p,
    images:p.images||template?.images||[],
    variants:((p.variants?.length?p.variants:template?.variants)||[]).map(v=>({
      ...v,
      image:v.image ?? template?.variants.find(tv=>tv.id===v.id)?.image,
    })),
  }
})
