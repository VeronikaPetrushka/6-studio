import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { HeroObjectPile } from '../components/HeroObjectPile'
import { ProductCard } from '../components/ProductCard'
import { useShop } from '../context/ShopContext'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage(){
  const {products}=useShop(); const stage=useRef<HTMLDivElement>(null); const track=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(!stage.current||!track.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const mm=gsap.matchMedia()
    mm.add('(min-width: 901px)',()=>{
      const distance=()=>Math.max(0,track.current!.scrollWidth-window.innerWidth+80)
      const tween=gsap.to(track.current,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:stage.current,start:'top top',end:()=>`+=${distance()*1.05}`,scrub:.85,pin:true,anticipatePin:1,invalidateOnRefresh:true}})
      return()=>tween.kill()
    })
    return()=>mm.revert()
  },[products])
  return <>
    <section className="hero kinetic-hero">
      <div className="kinetic-hero-grid" aria-hidden="true"/>
      <div className="kinetic-hero-copy">
        <span className="eyebrow">6.STUDIO · OBJECTS FOR LIVING</span>
        <h1><span>Предмети, що</span><em>задають тон.</em></h1>
        <p>Посуд, декор і свічки з характером. Обирайте об’єкти, які працюють у просторі ще до того, як ними починають користуватися.</p>
        <div className="kinetic-hero-actions">
          <Link to="/catalog" className="kinetic-primary">Дивитися колекцію <ArrowUpRight/></Link>
          <Link to="/about" className="kinetic-secondary">Про 6.STUDIO <span>→</span></Link>
        </div>
      </div>
      <div className="kinetic-hero-side-note" aria-hidden="true"><span>KYIV · 2026</span><span>CURATED OBJECTS</span></div>
      <HeroObjectPile/>
    </section>

    <section className="statement-section">
      <span className="eyebrow" data-reveal>THE SIXTH SENSE OF HOME</span>
      <h2 data-reveal>Не ще одна річ.<br/><em>Точка тяжіння.</em></h2>
      <p data-reveal>Ми збираємо предмети, які хочеться торкатися, переставляти, дарувати й залишати на видноті. Від культової «Планети» до посуду з характером.</p>
    </section>

    <section className="category-planes split-reveal">
      <Link to="/catalog?category=Свічки" className="category-plane split-a"><img src="/images/editorial-21.webp" alt="Свічки"/><div><small>01</small><h3>Свічки</h3><span>аромат · світло · об'єкт</span></div></Link>
      <Link to="/catalog?category=Посуд" className="category-plane split-b"><img src="/images/editorial-22.webp" alt="Посуд"/><div><small>02</small><h3>Посуд</h3><span>ритуал · сервірування</span></div></Link>
      <Link to="/catalog?category=Скло" className="category-plane split-a"><img src="/images/editorial-03.webp" alt="Скло"/><div><small>03</small><h3>Скло</h3><span>колір · прозорість</span></div></Link>
    </section>

    <section className="horizontal-products">
      <div className="horizontal-heading"><span className="eyebrow">SELECTED / WITH CHARACTER</span><h2>Речі, що<br/><em>говорять за вас.</em></h2><p>Для столу, полиці й подарунка — об’єкти, які додають простору характеру без зайвих слів.</p></div>
      <div className="product-stage" ref={stage}><div className="product-track" ref={track}>{products.filter(p=>p.featured).slice(0,8).map((p,i)=><ProductCard key={p.id} product={p} index={i}/>) }<Link to="/catalog" className="catalog-end-card"><span>ALL OBJECTS</span><b>До каталогу</b><ArrowUpRight/></Link></div></div>
    </section>

    <section className="variant-story">
      <div className="variant-image" data-parallax="8"><img src="/images/editorial-01.webp" alt="Ластівки"/></div>
      <div className="variant-copy" data-reveal><span className="eyebrow">ЛАСТІВКИ · СЕРІЯ ДЛЯ СТОЛУ</span><h2>Один мотив.<br/><em>Три ритми столу.</em></h2><p>Від ранкового сніданку до вечері з друзями — «Ластівки» збирають сервірування в одну легку історію. Оберіть формат, який природно пасує саме вашому столу.</p><div className="size-pills"><span>Гарнірна · Ø15.9 · 370 ₴</span><span>Основна · Ø19.1 · 420 ₴</span><span>Супова · Ø19.1 · 440 ₴</span></div><Link to="/product/lastivky" className="cta-dark">Відкрити «Ластівки» <ArrowUpRight/></Link></div>
    </section>

    <section className="cinematic-band">
      <div className="cinematic-media" data-cinematic-depth><img src="/images/editorial-02.webp" alt="Tea ritual"/></div>
      <div className="cinematic-overlay"><span className="eyebrow">TABLE STORIES · 6.STUDIO</span><h2>Стіл, що має<br/><em>свій характер.</em></h2><Link to="/collections">Дивитися добірки ↗</Link></div>
    </section>

    <section className="service-grid">
      {[['01','Обʼєкти з характером','Відбираємо речі, які працюють у просторі самі по собі — формою, кольором і настроєм.'],['02','Подарунок з інтонацією','Допоможемо знайти предмет, який відчувається особистим, а не випадковим.'],['03','Турботлива доставка','Кожне замовлення пакуємо так, щоб момент розпакування був частиною враження.'],['04','Малі дропи','Колекція змінюється невеликими партіями — у 6.STUDIO завжди є місце для нової знахідки.']].map(x=><article key={x[0]} data-reveal><small>{x[0]}</small><h3>{x[1]}</h3><p>{x[2]}</p></article>)}
    </section>

    <section className="lookbook">
      <div className="lookbook-title" data-reveal><span className="eyebrow">FROM @6.STUDIO_UA</span><h2>Not a catalogue.<br/><em>A point of view.</em></h2></div>
      <div className="lookbook-grid">{[5,9,11,13,16,18].map((n,i)=><figure key={n} className={`look-${i+1}`} data-reveal><img src={`/images/editorial-${String(n).padStart(2,'0')}.webp`} alt="6.STUDIO interior"/></figure>)}</div>
      <a className="instagram-link" target="_blank" rel="noreferrer" href="https://www.instagram.com/6.studio_ua">Instagram @6.studio_ua <ArrowUpRight/></a>
    </section>
  </>
}
