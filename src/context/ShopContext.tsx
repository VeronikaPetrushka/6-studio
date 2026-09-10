import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { defaultCategories, defaultProducts, type Product } from '../data/products'
import { newId, normalizeProducts, read, write, type CartItem, type Order, type OrderStatus } from '../lib/storage'

type Shop = {
  products: Product[]; setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: string[]; setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  cart: CartItem[]; add:(productId:string,variantId:string,qty?:number)=>void; updateQty:(productId:string,variantId:string,qty:number)=>void; remove:(productId:string,variantId:string)=>void; clear:()=>void;
  cartCount:number; cartTotal:number;
  orders:Order[]; createOrder:(payload:Omit<Order,'id'|'createdAt'|'status'>)=>Promise<Order>; updateOrderStatus:(id:string,status:OrderStatus)=>void;
}
const Ctx=createContext<Shop|null>(null)
export function ShopProvider({children}:{children:React.ReactNode}){
  const [products,setProducts]=useState<Product[]>(()=>normalizeProducts(read('products',defaultProducts)))
  const [categories,setCategories]=useState<string[]>(()=>read('categories',defaultCategories))
  const [cart,setCart]=useState<CartItem[]>(()=>read('cart',[]))
  const [orders,setOrders]=useState<Order[]>(()=>read('orders',[]))
  useEffect(()=>write('products',products),[products]); useEffect(()=>write('categories',categories),[categories]); useEffect(()=>write('cart',cart),[cart]); useEffect(()=>write('orders',orders),[orders])
  const add=(productId:string,variantId:string,qty=1)=>setCart(c=>{const i=c.findIndex(x=>x.productId===productId&&x.variantId===variantId);if(i<0)return[...c,{productId,variantId,quantity:qty}];return c.map((x,n)=>n===i?{...x,quantity:x.quantity+qty}:x)})
  const updateQty=(productId:string,variantId:string,qty:number)=>setCart(c=>c.map(x=>x.productId===productId&&x.variantId===variantId?{...x,quantity:Math.max(1,qty)}:x))
  const remove=(productId:string,variantId:string)=>setCart(c=>c.filter(x=>!(x.productId===productId&&x.variantId===variantId)))
  const clear=()=>setCart([])
  const cartCount=cart.reduce((a,b)=>a+b.quantity,0)
  const cartTotal=cart.reduce((sum,item)=>{const p=products.find(x=>x.id===item.productId);const v=p?.variants.find(x=>x.id===item.variantId);return sum+(v?.price||0)*item.quantity},0)
  const createOrder=async(payload:Omit<Order,'id'|'createdAt'|'status'>)=>{const order:Order={...payload,id:newId('ORDER'),createdAt:new Date().toISOString(),status:'new'};const endpoint=import.meta.env.VITE_ORDER_ENDPOINT; if(endpoint){const r=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(order)});if(!r.ok)throw new Error('Order endpoint failed')} setOrders(o=>[order,...o]);clear();return order}
  const updateOrderStatus=(id:string,status:OrderStatus)=>setOrders(o=>o.map(x=>x.id===id?{...x,status}:x))
  const value=useMemo(()=>({products,setProducts,categories,setCategories,cart,add,updateQty,remove,clear,cartCount,cartTotal,orders,createOrder,updateOrderStatus}),[products,categories,cart,cartCount,cartTotal,orders])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useShop=()=>{const v=useContext(Ctx);if(!v)throw new Error('ShopProvider missing');return v}
