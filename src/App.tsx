import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ShopProvider } from './context/ShopContext'
const Home=lazy(()=>import('./pages/HomePage'))
const Catalog=lazy(()=>import('./pages/CatalogPage'))
const Product=lazy(()=>import('./pages/ProductPage'))
const Collections=lazy(()=>import('./pages/CollectionsPage'))
const About=lazy(()=>import('./pages/AboutPage'))
const Cart=lazy(()=>import('./pages/CartPage'))
const Checkout=lazy(()=>import('./pages/CheckoutPage'))
const Success=lazy(()=>import('./pages/SuccessPage'))
const Admin=lazy(()=>import('./pages/admin/AdminPage'))
function Loader(){return <div className="route-loader"><span>6.</span></div>}
export default function App(){return <ShopProvider><BrowserRouter><Suspense fallback={<Loader/>}><Routes><Route element={<Layout/>}><Route path="/" element={<Home/>}/><Route path="/catalog" element={<Catalog/>}/><Route path="/collections" element={<Collections/>}/><Route path="/about" element={<About/>}/><Route path="/product/:id" element={<Product/>}/><Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/success/:id" element={<Success/>}/></Route><Route path="/admin" element={<Admin/>}/><Route path="*" element={<Home/>}/></Routes></Suspense></BrowserRouter></ShopProvider>}
