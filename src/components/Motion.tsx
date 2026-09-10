import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function MotionController(){
  const {pathname}=useLocation()

  useEffect(()=>{
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if(reduced) return

    let ctx: ReturnType<typeof gsap.context> | undefined
    const frame=requestAnimationFrame(()=>{
      ctx=gsap.context(()=>{
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el,i)=>{
          gsap.fromTo(el,{y:44,opacity:0},{y:0,opacity:1,duration:.9,delay:(i%3)*.03,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none reverse'}})
        })

        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el)=>{
          const amount=Number(el.dataset.parallax||10)
          gsap.fromTo(el,{yPercent:-amount},{yPercent:amount,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1.1}})
        })

        gsap.utils.toArray<HTMLElement>('[data-scale-scroll]').forEach(el=>{
          gsap.fromTo(el,{scale:.9,letterSpacing:'-.02em'},{scale:1.08,letterSpacing:'-.05em',ease:'none',transformOrigin:'50% 50%',scrollTrigger:{trigger:el,start:'top 90%',end:'bottom 15%',scrub:1}})
        })

        gsap.utils.toArray<HTMLElement>('.split-reveal').forEach((el)=>{
          const a=el.querySelector('.split-a'), b=el.querySelector('.split-b')
          if(a) gsap.fromTo(a,{xPercent:-10},{xPercent:4,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}})
          if(b) gsap.fromTo(b,{xPercent:10},{xPercent:-4,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}})
        })

        // Every inner-page hero has its own composition, but shares a polished entrance language.
        const hero=document.querySelector<HTMLElement>('[data-page-hero]')
        if(hero){
          const pieces=gsap.utils.toArray<HTMLElement>('[data-hero-piece]',hero)
          gsap.fromTo(pieces,
            {y:38,opacity:0,scale:.97},
            {y:0,opacity:1,scale:1,duration:1.05,stagger:.09,ease:'power4.out',clearProps:'transform'}
          )
          const heroImages=gsap.utils.toArray<HTMLImageElement>('figure img, .collections-hero-media img',hero)
          heroImages.forEach((img,i)=>{
            gsap.fromTo(img,{scale:1.08},{scale:1,duration:1.45,delay:.12+i*.08,ease:'power3.out'})
          })
        }

        // Cinematic table scene: subtle camera push + travel instead of a flat background.
        const cinematic=document.querySelector<HTMLElement>('[data-cinematic-depth]')
        if(cinematic){
          gsap.fromTo(cinematic,
            {scale:1.16,yPercent:-3},
            {scale:1.025,yPercent:3,ease:'none',scrollTrigger:{trigger:cinematic.parentElement,start:'top bottom',end:'bottom top',scrub:1.2}}
          )
          const img=cinematic.querySelector('img')
          if(img){
            gsap.fromTo(img,{filter:'brightness(.42) saturate(.72) contrast(1.08)'},{filter:'brightness(.58) saturate(.88) contrast(1.04)',ease:'none',scrollTrigger:{trigger:cinematic.parentElement,start:'top 85%',end:'bottom 15%',scrub:1.4}})
          }
        }

        ScrollTrigger.refresh()
      })
    })

    return()=>{
      cancelAnimationFrame(frame)
      ctx?.revert()
    }
  },[pathname])

  return null
}
