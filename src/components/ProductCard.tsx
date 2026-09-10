import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Product } from '../data/products'
import { useShop } from '../context/ShopContext'
export const money=(n:number)=>`${new Intl.NumberFormat('uk-UA').format(n)} ₴`
export function ProductCard({product,index=0}:{product:Product,index?:number}){
 const {add}=useShop(); const variant=product.variants[0]
 return <article className="product-card" data-reveal style={{'--i':index} as CSSProperties}>
   <Link className="product-media" to={`/product/${product.id}`}><img className="product-img-primary" src={product.images[0]} alt={product.name}/>{product.images[1]&&<img className="product-img-secondary" src={product.images[1]} alt=""/>}<span>{product.badge||product.category}</span><i>0{index+1}</i></Link>
   <div className="product-card-info">
     <div><small>{product.category}</small><h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3><p>{product.tagline}</p></div>
     <strong>{money(Math.min(...product.variants.map(v=>v.price)))}</strong>
   </div>
   <button className="add-line" onClick={()=>add(product.id,variant.id)}><span>Додати · {variant.label}</span><Plus size={19}/></button>
 </article>
}
