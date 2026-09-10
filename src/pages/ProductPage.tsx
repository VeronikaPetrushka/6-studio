import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { useShop } from '../context/ShopContext'
import { money, ProductCard } from '../components/ProductCard'
import type { ProductVariant } from '../data/products'

export default function ProductPage(){
  const {id}=useParams()
  const {products,add}=useShop()
  const p=products.find(x=>x.id===id)
  const [image,setImage]=useState(0)
  const [variant,setVariant]=useState(p?.variants[0]?.id||'')
  const [qty,setQty]=useState(1)

  const related=useMemo(()=>products.filter(x=>x.category===p?.category&&x.id!==p?.id).slice(0,3),[products,p])

  useEffect(()=>{
    if(!p)return
    const first=p.variants[0]
    setVariant(first?.id||'')
    const mapped=first?.image ? p.images.indexOf(first.image) : 0
    setImage(mapped>=0?mapped:0)
    setQty(1)
  },[p?.id])

  if(!p)return <div className="notfound">Обʼєкт не знайдено.</div>
  const v=p.variants.find(x=>x.id===variant)||p.variants[0]

  const selectVariant=(next:ProductVariant)=>{
    setVariant(next.id)
    if(next.image){
      const nextImage=p.images.indexOf(next.image)
      if(nextImage>=0)setImage(nextImage)
    }
  }

  return <>
    <section className="product-detail">
      <div className="product-gallery">
        <div className="thumbs">
          {p.images.map((img,i)=><button key={img} className={i===image?'active':''} onClick={()=>setImage(i)} aria-label={`Фото ${i+1}`}><img src={img} alt=""/></button>)}
        </div>
        <div className="main-product-image"><img className="product-main-visual" key={p.images[image]} src={p.images[image]} alt={p.name}/></div>
      </div>
      <div className="product-buy">
        <span className="eyebrow">{p.category} · {p.badge||'6.STUDIO'}</span>
        <h1>{p.name}</h1>
        <p className="lead">{p.tagline}</p>
        <p>{p.description}</p>
        <div className="variant-box">
          <small>Оберіть формат</small>
          {p.variants.map(x=><button key={x.id} className={variant===x.id?'active':''} onClick={()=>selectVariant(x)}><span>{x.label}</span><b>{money(x.price)}</b></button>)}
        </div>
        <div className="buy-row">
          <div className="qty"><button onClick={()=>setQty(q=>Math.max(1,q-1))}><Minus/></button><span>{qty}</span><button onClick={()=>setQty(q=>q+1)}><Plus/></button></div>
          <button className="buy-main" onClick={()=>add(p.id,v.id,qty)}><ShoppingBag/> Додати · {money(v.price*qty)}</button>
        </div>
        <ul>{p.details.map(d=><li key={d}>{d}</li>)}</ul>
      </div>
    </section>
    <section className="related">
      <div className="related-heading">
        <span className="eyebrow">ДО ВАШОГО ВИБОРУ</span>
        <h2>Добре пасуватимуть поруч.</h2>
      </div>
      <div className="catalog-grid compact">{related.map((x,i)=><ProductCard product={x} index={i} key={x.id}/>)}</div>
    </section>
  </>
}
