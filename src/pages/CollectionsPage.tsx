import { Link } from 'react-router-dom'

export default function CollectionsPage(){
  const collections=[
    ['Dinner after dark','Тарілки, келихи й свічки для вечері, яка не закінчується після десерту.','/images/editorial-03.webp','Посуд'],
    ['Soft brutalism','Білий рельєф, бетонні фактури й скульптурні свічки.','/images/editorial-12.webp','Свічки'],
    ['Color therapy','Рожеве, жовте, зелене — маленькі обʼєкти, що змінюють кімнату.','/images/editorial-13.webp','Свічки'],
  ]
  return <>
    <section className="page-hero collections-hero-new" data-page-hero>
      <div className="collections-hero-media media-a" data-hero-piece><img src="/images/editorial-03.webp" alt="6.STUDIO table setting"/></div>
      <div className="collections-hero-media media-b" data-hero-piece><img src="/images/editorial-13.webp" alt="6.STUDIO objects"/></div>
      <div className="collections-hero-copy" data-hero-piece>
        <span className="eyebrow">CURATED SCENES · 01—03</span>
        <h1>Зібрані<br/><em>за відчуттям.</em></h1>
        <p>Не правила сервірування, а готові настрої: для вечері, подарунка, полиці або моменту, який хочеться зробити особливим.</p>
      </div>
      <div className="collections-hero-seal" data-hero-piece><span>6.</span><small>CURATED<br/>WITH INTUITION</small></div>
    </section>

    <section className="collection-editorial">
      {collections.map((x,i)=><article key={x[0]} className={i%2?'reverse':''}><div data-reveal><span>0{i+1}</span><h2>{x[0]}</h2><p>{x[1]}</p><Link to={`/catalog?category=${x[3]}`}>Відкрити добірку ↗</Link></div><figure data-parallax="7"><img src={x[2]} alt=""/></figure></article>)}
    </section>
  </>
}
