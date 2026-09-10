import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useShop } from '../context/ShopContext'
import { ProductCard } from '../components/ProductCard'

export default function CatalogPage(){
  const {products,categories}=useShop()
  const [params,setParams]=useSearchParams()
  const [q,setQ]=useState('')
  const selected=params.get('category')||'Усі'
  const list=useMemo(()=>products.filter(p=>(selected==='Усі'||p.category===selected)&&(`${p.name} ${p.tagline}`.toLowerCase().includes(q.toLowerCase()))),[products,selected,q])
  const heroObjects=(list.length?list:products).slice(0,3)

  return <>
    <section className="page-hero catalog-hero catalog-hero-new" data-page-hero>
      <div className="page-hero-grid" aria-hidden="true"/>
      <div className="catalog-hero-copy" data-hero-piece>
        <span className="eyebrow">OBJECT INDEX · 6.STUDIO</span>
        <h1>Речі, які<br/><em>залишаються.</em></h1>
        <p>Посуд, свічки, скло й декор — добірка предметів, що додають простору власний ритм.</p>
      </div>
      <div className="catalog-hero-stack" aria-hidden="true">
        {heroObjects.map((p,i)=><figure key={p.id} className={`catalog-hero-object object-${i+1}`} data-hero-piece><img src={p.images[0]} alt=""/></figure>)}
      </div>
      <div className="catalog-hero-index" data-hero-piece><small>У ДОБІРЦІ</small><b>{String(list.length).padStart(2,'0')}</b><span>{selected}</span></div>
    </section>

    <section className="catalog-shell">
      <div className="catalog-toolbar">
        <div className="filter-row">{['Усі',...categories].map(c=><button key={c} className={selected===c?'active':''} onClick={()=>setParams(c==='Усі'?{}:{category:c})}>{c}</button>)}</div>
        <label><Search size={17}/><input placeholder="Знайти обʼєкт" value={q} onChange={e=>setQ(e.target.value)}/></label>
      </div>
      <div className="catalog-grid">{list.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>
    </section>
  </>
}
