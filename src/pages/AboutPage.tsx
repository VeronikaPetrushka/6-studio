export default function AboutPage(){
  return <>
    <section className="page-hero about-hero-new" data-page-hero>
      <div className="about-hero-six" data-hero-piece>6.</div>
      <div className="about-hero-copy" data-hero-piece>
        <span className="eyebrow">ABOUT 6.STUDIO · KYIV</span>
        <h1>Шосте відчуття<br/><em>для простору.</em></h1>
        <p>Ми збираємо посуд, декор і свічки, які не просять дозволу бути помітними. Один влучний предмет може змінити настрій цілого столу.</p>
      </div>
      <figure className="about-hero-photo photo-a" data-hero-piece><img src="/images/editorial-14.webp" alt="6.STUDIO mood"/></figure>
      <figure className="about-hero-photo photo-b" data-hero-piece><img src="/images/editorial-18.webp" alt="6.STUDIO objects"/></figure>
      <div className="about-hero-caption" data-hero-piece>OBJECTS / INTUITION / HOME</div>
    </section>

    <section className="about-grid">
      <div data-reveal><h2>Дім — не showroom.</h2><p>Тому речі не повинні бути бездоганно нейтральними. Ми любимо дзеркальний блиск, ручний рельєф, кольорове скло, наївні написи й форми, що викликають реакцію.</p></div>
      <figure data-parallax="9"><img src="/images/editorial-14.webp" alt="6.STUDIO mood"/></figure>
      <figure data-parallax="5"><img src="/images/editorial-01.webp" alt="6.STUDIO table"/></figure>
      <div data-reveal><span className="eyebrow">WHY SIX?</span><h2>Шосте відчуття простору.</h2><p>Не правило стилю, а інтуїція: коли один предмет раптом робить весь стіл або полицю правильними.</p></div>
    </section>
  </>
}
