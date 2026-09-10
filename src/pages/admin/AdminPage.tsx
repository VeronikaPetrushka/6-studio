import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CalendarDays, Check, ChevronDown, CreditCard, ExternalLink, ImagePlus, LayoutDashboard, LogOut, Mail, MapPin, MessageSquareText, Package, Phone, Plus, RotateCcw, ShoppingBag, Tags, Trash2, Truck, UserRound } from 'lucide-react'
import { useShop } from '../../context/ShopContext'
import type { Product, ProductVariant } from '../../data/products'
import { money } from '../../components/ProductCard'
import type { OrderStatus } from '../../lib/storage'

const LOGIN=import.meta.env.VITE_ADMIN_LOGIN||'admin', PASS=import.meta.env.VITE_ADMIN_PASSWORD||'studio2026'
const emptyProduct:Product={id:'',name:'',category:'Свічки',tagline:'',description:'',images:[],variants:[{id:'default',label:'Стандарт',price:0,stock:0}],details:[]}
async function filesToDataUrls(files:FileList){const list=[...files].slice(0,8);return Promise.all(list.map(f=>new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=reject;r.readAsDataURL(f)})))}
export default function AdminPage(){
 const [auth,setAuth]=useState(()=>sessionStorage.getItem('sixstudio:admin')==='1'); const [tab,setTab]=useState<'dash'|'products'|'categories'|'orders'>('dash'); const [editing,setEditing]=useState<Product|null>(null); const {products,setProducts,categories,setCategories,orders,updateOrderStatus}=useShop()
 if(!auth)return <AdminLogin onSuccess={()=>{sessionStorage.setItem('sixstudio:admin','1');setAuth(true)}}/>
 const counts={products:products.length,orders:orders.length,new:orders.filter(o=>o.status==='new').length}
 return <div className="admin-shell"><aside><div className="admin-brand">6.<span>ADMIN</span></div><nav><button className={tab==='dash'?'active':''} onClick={()=>setTab('dash')}><LayoutDashboard/>Огляд</button><button className={tab==='products'?'active':''} onClick={()=>setTab('products')}><Package/>Товари</button><button className={tab==='categories'?'active':''} onClick={()=>setTab('categories')}><Tags/>Категорії</button><button className={tab==='orders'?'active':''} onClick={()=>setTab('orders')}><ShoppingBag/>Замовлення <b>{counts.new}</b></button></nav><div className="admin-side-actions"><a href="/" target="_blank" rel="noreferrer"><ExternalLink/>Перейти на сайт</a><button onClick={()=>{sessionStorage.removeItem('sixstudio:admin');location.reload()}}><LogOut/>Вийти</button></div></aside><section className="admin-main">
 {tab==='dash'&&<><h1>Dashboard</h1><div className="admin-stats"><article><span>Товари</span><b>{counts.products}</b></article><article><span>Замовлення</span><b>{counts.orders}</b></article><article><span>Нові</span><b>{counts.new}</b></article></div><p className="admin-note">Demo CMS: товари, категорії, фото та замовлення зберігаються в localStorage. Для production дані слід перенести в Supabase/іншу БД + cloud storage.</p></>}
 {tab==='products'&&<ProductsAdmin products={products} categories={categories} onEdit={setEditing} onDelete={id=>setProducts(x=>x.filter(p=>p.id!==id))} onMove={(id,dir)=>setProducts(list=>{const i=list.findIndex(p=>p.id===id);const j=i+dir;if(i<0||j<0||j>=list.length)return list;const next=[...list];[next[i],next[j]]=[next[j],next[i]];return next})} onCreate={()=>setEditing({...emptyProduct,id:`item-${Date.now()}`})}/>} 
 {tab==='categories'&&<CategoriesAdmin categories={categories} setCategories={setCategories} products={products} setProducts={setProducts}/>} 
 {tab==='orders'&&<OrdersAdmin orders={orders} products={products} update={updateOrderStatus}/>} 
 </section>{editing&&<ProductEditor initial={editing} categories={categories} onClose={()=>setEditing(null)} onSave={p=>{setProducts(list=>list.some(x=>x.id===p.id)?list.map(x=>x.id===p.id?p:x):[p,...list]);setEditing(null)}}/>}</div>
}
function AdminLogin({onSuccess}:{onSuccess:()=>void}){const [err,setErr]=useState('');const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);if(f.get('login')===LOGIN&&f.get('password')===PASS)onSuccess();else setErr('Невірний логін або пароль')};return <div className="admin-login"><form onSubmit={submit}><div className="admin-logo">6.</div><small>6.STUDIO / PRIVATE</small><h1>Admin panel</h1><label>Login<input name="login" defaultValue="admin"/></label><label>Password<input name="password" type="password" defaultValue="studio2026"/></label>{err&&<p>{err}</p>}<button>Увійти</button></form></div>}
function ProductsAdmin({products,categories,onEdit,onDelete,onMove,onCreate}:{products:Product[],categories:string[],onEdit:(p:Product)=>void,onDelete:(id:string)=>void,onMove:(id:string,dir:number)=>void,onCreate:()=>void}){const [filter,setFilter]=useState('Усі');const list=filter==='Усі'?products:products.filter(p=>p.category===filter);return <><div className="admin-title-row"><div><small>CATALOGUE CMS</small><h1>Товари</h1></div><button onClick={onCreate}><Plus/>Додати товар</button></div><div className="admin-filters">{['Усі',...categories].map(c=><button className={filter===c?'active':''} onClick={()=>setFilter(c)} key={c}>{c}</button>)}</div><div className="admin-product-list">{list.map(p=><article key={p.id}><img src={p.images[0]} alt=""/><div><small>{p.category}</small><h3>{p.name}</h3><p>{p.variants.map(v=>`${v.label}: ${money(v.price)}`).join(' · ')}</p></div><div><button title="Вище" onClick={()=>onMove(p.id,-1)}><ArrowUp/></button><button title="Нижче" onClick={()=>onMove(p.id,1)}><ArrowDown/></button><button onClick={()=>onEdit(p)}>Редагувати</button><button className="danger" onClick={()=>confirm('Видалити товар?')&&onDelete(p.id)}><Trash2/></button></div></article>)}</div></>}
function ProductEditor({initial,categories,onClose,onSave}:{initial:Product,categories:string[],onClose:()=>void,onSave:(p:Product)=>void}){const [p,setP]=useState<Product>(JSON.parse(JSON.stringify(initial)));const upload=async(e:ChangeEvent<HTMLInputElement>)=>{if(!e.target.files)return;const urls=await filesToDataUrls(e.target.files);setP(x=>({...x,images:[...x.images,...urls].slice(0,8)}))};const save=(e:FormEvent)=>{e.preventDefault();if(!p.name||!p.category||!p.images.length)return alert('Додайте назву, категорію і хоча б одне фото');onSave(p)};return <div className="admin-modal"><form onSubmit={save}><div className="modal-head"><h2>{initial.name?'Редагувати товар':'Новий товар'}</h2><button type="button" onClick={onClose}>✕</button></div><div className="editor-grid"><label>Назва<input value={p.name} onChange={e=>setP({...p,name:e.target.value})}/></label><label>Категорія<select value={p.category} onChange={e=>setP({...p,category:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label className="full">Короткий підпис<input value={p.tagline} onChange={e=>setP({...p,tagline:e.target.value})}/></label><label className="full">Опис<textarea rows={4} value={p.description} onChange={e=>setP({...p,description:e.target.value})}/></label><label>Badge<input value={p.badge||''} onChange={e=>setP({...p,badge:e.target.value})}/></label><label><input type="checkbox" checked={!!p.featured} onChange={e=>setP({...p,featured:e.target.checked})}/> Featured на головній</label></div><div className="photo-editor"><h3>Фото · до 8</h3><div>{p.images.map((img,i)=><figure key={i}><img src={img}/><button type="button" onClick={()=>setP({...p,images:p.images.filter((_,n)=>n!==i)})}>×</button><div className="photo-order"><button type="button" disabled={i===0} onClick={()=>{const a=[...p.images];[a[i-1],a[i]]=[a[i],a[i-1]];setP({...p,images:a})}}><ArrowLeft/></button><button type="button" disabled={i===p.images.length-1} onClick={()=>{const a=[...p.images];[a[i+1],a[i]]=[a[i],a[i+1]];setP({...p,images:a})}}><ArrowRight/></button></div>{i>0&&<button type="button" className="cover" onClick={()=>setP({...p,images:[img,...p.images.filter((_,n)=>n!==i)]})}>cover</button>}</figure>)}<label className="upload"><ImagePlus/><span>Завантажити</span><input type="file" multiple accept="image/*" onChange={upload}/></label></div></div><VariantEditor variants={p.variants} images={p.images} setVariants={variants=>setP({...p,variants})}/><div className="modal-actions"><button type="button" onClick={onClose}>Скасувати</button><button className="save">Зберегти</button></div></form></div>}
function VariantEditor({variants,images,setVariants}:{variants:ProductVariant[],images:string[],setVariants:(v:ProductVariant[])=>void}){return <div className="variant-editor"><div className="admin-title-row"><div><small>SIZE / IMAGE MAP</small><h3>Розміри / варіанти</h3></div><button type="button" onClick={()=>setVariants([...variants,{id:`v-${Date.now()}`,label:'Новий розмір',price:0,stock:0,image:''}])}><Plus/>Варіант</button></div><div className="variant-columns"><span>Назва</span><span>Ціна</span><span>Stock</span><span>Фото при виборі</span><span/></div>{variants.map((v,i)=><div className="variant-row" key={v.id}><input aria-label="Назва варіанту" value={v.label} onChange={e=>setVariants(variants.map((x,n)=>n===i?{...x,label:e.target.value}:x))}/><input aria-label="Ціна" type="number" value={v.price} onChange={e=>setVariants(variants.map((x,n)=>n===i?{...x,price:+e.target.value}:x))}/><input aria-label="Залишок" type="number" value={v.stock} onChange={e=>setVariants(variants.map((x,n)=>n===i?{...x,stock:+e.target.value}:x))}/><select aria-label="Фото варіанту" value={v.image||''} onChange={e=>setVariants(variants.map((x,n)=>n===i?{...x,image:e.target.value}:x))}><option value="">Обкладинка / без прив’язки</option>{images.map((img,n)=><option key={`${img}-${n}`} value={img}>Фото {n+1}</option>)}</select><button type="button" onClick={()=>setVariants(variants.filter((_,n)=>n!==i))}><Trash2/></button></div>)}</div>}
function CategoriesAdmin({categories,setCategories,products,setProducts}:{categories:string[],setCategories:React.Dispatch<React.SetStateAction<string[]>>,products:Product[],setProducts:React.Dispatch<React.SetStateAction<Product[]>>}){const [name,setName]=useState('');return <><div className="admin-title-row"><div><small>TAXONOMY</small><h1>Категорії</h1></div><form onSubmit={e=>{e.preventDefault();if(name&&!categories.includes(name)){setCategories(x=>[...x,name]);setName('')}}}><input value={name} onChange={e=>setName(e.target.value)} placeholder="Нова категорія"/><button><Plus/>Додати</button></form></div><div className="category-admin-list">{categories.map(c=><article key={c}><span>{c}</span><b>{products.filter(p=>p.category===c).length} товарів</b><button onClick={()=>{if(!confirm(`Видалити ${c}?`))return;const fallback=categories.find(x=>x!==c)||'Інше';setCategories(x=>x.filter(y=>y!==c));setProducts(x=>x.map(p=>p.category===c?{...p,category:fallback}:p))}}><Trash2/></button></article>)}</div></>}
function OrdersAdmin({orders,products,update}:{orders:ReturnType<typeof useShop>['orders'],products:Product[],update:(id:string,s:OrderStatus)=>void}){
 const [statusFilter,setStatusFilter]=useState<'all'|OrderStatus>('all')
 const [dateFrom,setDateFrom]=useState('')
 const [dateTo,setDateTo]=useState('')
 const statusMeta:Record<OrderStatus,{label:string,className:string,caption:string}>={
  new:{label:'Нове',className:'new',caption:'Очікує перегляду'},
  seen:{label:'Переглянуто',className:'seen',caption:'Замовлення відкрито'},
  in_process:{label:'В роботі',className:'in-process',caption:'Готуємо замовлення'},
  shipped:{label:'Відправлено',className:'shipped',caption:'Передано в доставку'},
 }
 const statusCounts=useMemo(()=>({
  all:orders.length,
  new:orders.filter(o=>o.status==='new').length,
  seen:orders.filter(o=>o.status==='seen').length,
  in_process:orders.filter(o=>o.status==='in_process').length,
  shipped:orders.filter(o=>o.status==='shipped').length,
 }),[orders])
 const filtered=useMemo(()=>{
  const from=dateFrom?new Date(`${dateFrom}T00:00:00`).getTime():null
  const to=dateTo?new Date(`${dateTo}T23:59:59.999`).getTime():null
  return orders.filter(o=>{
   const created=new Date(o.createdAt).getTime()
   if(statusFilter!=='all'&&o.status!==statusFilter)return false
   if(from!==null&&created<from)return false
   if(to!==null&&created>to)return false
   return true
  }).sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())
 },[orders,statusFilter,dateFrom,dateTo])
 const reset=()=>{setStatusFilter('all');setDateFrom('');setDateTo('')}
 return <>
  <div className="admin-title-row orders-heading"><div><small>ORDER CRM</small><h1>Замовлення</h1></div><div className="orders-total"><span>Показано</span><b>{filtered.length}</b><small>з {orders.length}</small></div></div>
  <div className="orders-toolbar">
   <div className="order-status-filters" aria-label="Фільтр за статусом">
    <button className={statusFilter==='all'?'active':''} onClick={()=>setStatusFilter('all')}>Усі <b>{statusCounts.all}</b></button>
    {(Object.keys(statusMeta) as OrderStatus[]).map(status=><button key={status} className={`${statusMeta[status].className} ${statusFilter===status?'active':''}`} onClick={()=>setStatusFilter(status)}>{statusMeta[status].label}<b>{statusCounts[status]}</b></button>)}
   </div>
   <div className="order-date-filters">
    <CalendarDays/>
    <label><span>Від</span><input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}/></label>
    <label><span>До</span><input type="date" value={dateTo} min={dateFrom||undefined} onChange={e=>setDateTo(e.target.value)}/></label>
    {(statusFilter!=='all'||dateFrom||dateTo)&&<button className="orders-reset" onClick={reset}><RotateCcw/>Скинути</button>}
   </div>
  </div>
  <div className="orders-list">
   {orders.length===0&&<p className="orders-empty">Замовлень ще немає.</p>}
   {orders.length>0&&filtered.length===0&&<p className="orders-empty">За цими фільтрами замовлень не знайдено.</p>}
   {filtered.map(o=>{
    const itemRows=o.items.map((x,i)=>{
     const product=products.find(p=>p.id===x.productId)
     const variant=product?.variants.find(v=>v.id===x.variantId)
     const unitPrice=variant?.price||0
     const image=variant?.image||product?.images?.[0]||''
     return {key:`${o.id}-${i}`,product,variant,quantity:x.quantity,unitPrice,lineTotal:unitPrice*x.quantity,image}
    })
    return <article key={o.id} className={`order-card order-card--${statusMeta[o.status].className}`}>
     <div className="order-top">
      <div className="order-identity"><small>{new Date(o.createdAt).toLocaleString('uk-UA')}</small><h3>{o.id}</h3><span className="order-caption">{o.items.reduce((sum,x)=>sum+x.quantity,0)} позицій · {money(o.total)}</span></div>
      <details className={`order-status-menu status-${statusMeta[o.status].className}`}>
       <summary aria-label={`Статус: ${statusMeta[o.status].label}`}><span className="status-dot"/><span><b>{statusMeta[o.status].label}</b><small>{statusMeta[o.status].caption}</small></span><ChevronDown/></summary>
       <div className="status-options">
        <span className="status-options-label">Змінити статус</span>
        {(Object.keys(statusMeta) as OrderStatus[]).map(v=><button type="button" key={v} className={`status-option option-${statusMeta[v].className} ${o.status===v?'active':''}`} onClick={e=>{update(o.id,v);(e.currentTarget.closest('details') as HTMLDetailsElement|null)?.removeAttribute('open')}}><i/><span><b>{statusMeta[v].label}</b><small>{statusMeta[v].caption}</small></span>{o.status===v&&<Check/>}</button>)}
       </div>
      </details>
     </div>

     <div className="order-details-grid">
      <section className="order-detail-block"><div className="order-detail-title"><UserRound/><span>Клієнт</span></div><dl><div><dt>Імʼя</dt><dd>{o.customer.name||'—'}</dd></div><div><dt><Phone/>Телефон</dt><dd><a href={`tel:${o.customer.phone}`}>{o.customer.phone||'—'}</a></dd></div><div><dt><Mail/>Email</dt><dd>{o.customer.email?<a href={`mailto:${o.customer.email}`}>{o.customer.email}</a>:'—'}</dd></div></dl></section>
      <section className="order-detail-block"><div className="order-detail-title"><Truck/><span>Доставка</span></div><dl><div><dt><MapPin/>Місто</dt><dd>{o.customer.city||'—'}</dd></div><div><dt>Спосіб</dt><dd>{o.customer.delivery||'—'}</dd></div><div><dt>Відділення / адреса</dt><dd>{o.customer.address||'—'}</dd></div></dl></section>
      <section className="order-detail-block order-payment-block"><div className="order-detail-title"><CreditCard/><span>Оплата</span></div><dl><div><dt>Метод</dt><dd>{o.payment==='card'?'Карткою онлайн':'При отриманні'}</dd></div><div><dt>Сума</dt><dd className="order-money">{money(o.total)}</dd></div></dl></section>
     </div>

     <div className="order-line-items">
      <div className="order-line-items-head"><span>Товари</span><b>{o.items.reduce((sum,x)=>sum+x.quantity,0)} шт.</b></div>
      {itemRows.map(row=><div className="order-line-item" key={row.key}>
       <div className="order-line-product">{row.image?<img src={row.image} alt=""/>:<div className="order-line-placeholder"/>}<div><b>{row.product?.name||row.product?.id||'Товар'}</b><small>{row.variant?.label||'Стандартний варіант'}</small></div></div>
       <span>{row.quantity} × {money(row.unitPrice)}</span><strong>{money(row.lineTotal)}</strong>
      </div>)}
     </div>

     {o.customer.comment&&<div className="order-comment"><MessageSquareText/><div><span>Коментар клієнта</span><p>{o.customer.comment}</p></div></div>}
     <div className="order-total-row"><span>Разом</span><strong>{money(o.total)}</strong></div>
    </article>
   })}
  </div>
 </>
}
