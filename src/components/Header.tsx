import { Menu, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
export function Header(){
 const [open,setOpen]=useState(false); const {cartCount}=useShop()
 return <header className="site-header">
   <Link to="/" className="brandmark"><span className="brand-six">6</span><span>.STUDIO</span></Link>
   <nav className={open?'open':''}>
     <NavLink to="/catalog" onClick={()=>setOpen(false)}>Каталог</NavLink>
     <NavLink to="/collections" onClick={()=>setOpen(false)}>Колекції</NavLink>
     <NavLink to="/about" onClick={()=>setOpen(false)}>Про студію</NavLink>
     <a href="https://www.instagram.com/6.studio_ua" target="_blank" rel="noreferrer">Instagram ↗</a>
   </nav>
   <div className="header-actions">
     <Link to="/cart" className="cart-pill"><ShoppingBag size={18}/><span>Кошик</span><b>{cartCount}</b></Link>
     <button className="menu-button" aria-label="Меню" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
   </div>
 </header>
}
