import { CSSProperties, useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'

type ObjectSpec = {
  key: string
  src: string
  size: number
  aspect: number
  rotation: number
  seed: number
}

type Body = {
  el: HTMLDivElement
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  va: number
  w: number
  h: number
  radius: number
  mass: number
  delay: number
}

const sourceDimensions: Record<number, [number, number]> = {
  16:[656,708],17:[1098,1210],18:[578,670],19:[730,778],20:[728,684],
  21:[828,782],22:[790,670],23:[776,836],24:[672,838],25:[548,669],
  26:[676,669],27:[929,812],28:[890,916],29:[890,916],30:[1130,1106],
  31:[716,1406],32:[702,811],33:[1118,1146],34:[618,616],35:[1055,1153],
}

const objectPlan = [
  [18,118,-11,.13],[28,150,8,.76],[31,86,-7,.37],[17,116,12,.58],[23,118,-9,.92],
  [20,112,4,.27],[33,145,-12,.49],[19,105,7,.83],[16,104,-8,.05],[34,118,9,.67],
  [24,108,-6,.31],[30,124,11,.72],[22,126,-10,.18],[32,88,7,.54],[21,120,9,.89],
  [35,112,-7,.42],[25,102,8,.63],[29,140,-8,.96],[18,92,14,.22],[31,78,8,.80],
] as const

function seeded(index:number, salt=0){
  const x=Math.sin((index+1)*91.173 + salt*17.13)*43758.5453
  return x-Math.floor(x)
}

export function HeroObjectPile(){
  const shell=useRef<HTMLDivElement>(null)
  const refs=useRef<(HTMLDivElement|null)[]>([])
  const objects=useMemo<ObjectSpec[]>(()=>objectPlan.map(([n,size,rotation,seed],i)=>{
    const [w,h]=sourceDimensions[n]
    return {key:`${n}-${i}`,src:`/hero-objects/object-${n}.webp`,size,aspect:w/h,rotation,seed}
  }),[])

  useEffect(()=>{
    const container=shell.current
    if(!container) return
    const nodes=refs.current.filter(Boolean) as HTMLDivElement[]
    if(nodes.length!==objects.length) return

    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if(reduced){
      nodes.forEach((el,i)=>{
        const x=4+(i%(Math.max(1,Math.floor(nodes.length/2))))*8.7
        el.style.left=`${Math.min(92,x)}%`
        el.style.bottom=`${(i%2)*48-8}px`
        el.style.transform=`translate(-50%,0) rotate(${objects[i].rotation}deg)`
      })
      return
    }

    let width=container.clientWidth
    let height=container.clientHeight
    let bodies:Body[]=[]
    let raf=0
    let running=true
    let last=performance.now()
    let elapsed=0
    const pointer={x:width/2,y:height*.38,px:width/2,py:height*.38,vx:0,vy:0,active:false,last:performance.now()}

    const measure=(reset=false)=>{
      width=container.clientWidth
      height=container.clientHeight
      bodies=nodes.map((el,i)=>{
        const old=bodies[i]
        const w=el.offsetWidth
        const h=el.offsetHeight
        const safeW=Math.max(42,w)
        const safeH=Math.max(42,h)
        // Collision radius deliberately follows the visible core, not the transparent PNG bounds.
        const radius=Math.max(28,Math.min(safeW,safeH)*.39)
        const lane=(i+.5)/nodes.length
        const jitter=(seeded(i,3)-.5)*Math.min(90,width*.055)
        const x=reset||!old ? Math.max(safeW*.5+4,Math.min(width-safeW*.5-4,lane*width+jitter)) : Math.max(safeW*.5,Math.min(width-safeW*.5,old.x))
        const y=reset||!old ? Math.max(safeH*.5, height*.02 + seeded(i,7)*height*.22 - i*1.8) : Math.min(height-safeH*.5,old.y)
        return {
          el,x,y,
          vx: reset||!old ? (seeded(i,9)-.5)*30 : old.vx,
          vy: reset||!old ? seeded(i,10)*20 : old.vy,
          angle: reset||!old ? objects[i].rotation : old.angle,
          va: reset||!old ? (seeded(i,12)-.5)*.55 : old.va,
          w:safeW,h:safeH,radius,
          mass:Math.max(.75,(safeW*safeH)/14500),
          delay:i*.035,
        }
      })
    }

    // Wait one frame so responsive object sizes are measurable.
    requestAnimationFrame(()=>measure(true))

    const onPointerMove=(event:PointerEvent)=>{
      const rect=container.getBoundingClientRect()
      const now=performance.now()
      const dt=Math.max(8,now-pointer.last)/1000
      pointer.px=pointer.x; pointer.py=pointer.y
      pointer.x=event.clientX-rect.left
      pointer.y=event.clientY-rect.top
      pointer.vx=(pointer.x-pointer.px)/dt
      pointer.vy=(pointer.y-pointer.py)/dt
      pointer.last=now
      pointer.active=pointer.x>=-80&&pointer.x<=width+80&&pointer.y>=-100&&pointer.y<=height+100
    }
    const onPointerLeave=()=>{ pointer.active=false }
    const onPointerDown=(event:PointerEvent)=>{
      onPointerMove(event)
      for(const body of bodies){
        const dx=body.x-pointer.x,dy=body.y-pointer.y
        const d=Math.hypot(dx,dy)||1
        if(d<190){
          const force=(1-d/190)*720
          body.vx+=(dx/d)*force/body.mass
          body.vy+=(dy/d)*force/body.mass-120
          body.va+=(seeded(Math.round(body.x+body.y),4)-.5)*5
        }
      }
    }

    container.addEventListener('pointermove',onPointerMove,{passive:true})
    container.addEventListener('pointerleave',onPointerLeave,{passive:true})
    container.addEventListener('pointerdown',onPointerDown,{passive:true})

    const solvePair=(a:Body,b:Body)=>{
      const dx=b.x-a.x,dy=b.y-a.y
      const dist=Math.hypot(dx,dy)||.001
      const minDist=a.radius+b.radius
      if(dist>=minDist) return
      const nx=dx/dist,ny=dy/dist
      const overlap=minDist-dist
      const invA=1/a.mass,invB=1/b.mass,total=invA+invB
      const correction=overlap*.58
      a.x-=nx*correction*(invA/total)
      a.y-=ny*correction*(invA/total)
      b.x+=nx*correction*(invB/total)
      b.y+=ny*correction*(invB/total)

      const rvx=b.vx-a.vx,rvy=b.vy-a.vy
      const rel=rvx*nx+rvy*ny
      if(rel<0){
        const restitution=.54
        const impulse=-(1+restitution)*rel/total
        const ix=impulse*nx,iy=impulse*ny
        a.vx-=ix*invA; a.vy-=iy*invA
        b.vx+=ix*invB; b.vy+=iy*invB
        const tangent=(-ny*rvx+nx*rvy)
        a.va-=tangent*.0018*invA
        b.va+=tangent*.0018*invB
      }
    }

    const tick=(now:number)=>{
      if(!running)return
      const dt=Math.min(.026,Math.max(.008,(now-last)/1000))
      last=now
      elapsed+=dt
      const gravity=760

      for(const body of bodies){
        if(elapsed<body.delay) continue
        body.vy+=gravity*dt

        if(pointer.active){
          const dx=body.x-pointer.x,dy=body.y-pointer.y
          const dist=Math.hypot(dx,dy)||1
          const reach=body.radius+92
          if(dist<reach){
            const strength=(1-dist/reach)
            const speed=Math.min(1500,Math.hypot(pointer.vx,pointer.vy))
            const impulse=(250+speed*.24)*strength
            body.vx+=(dx/dist)*impulse*dt/body.mass + pointer.vx*.014*strength/body.mass
            body.vy+=(dy/dist)*impulse*dt/body.mass + pointer.vy*.011*strength/body.mass
            body.va+=(pointer.vx*dy-pointer.vy*dx)*.0000028*strength
          }
        }

        body.vx*=Math.pow(.988,dt*60)
        body.vy*=Math.pow(.996,dt*60)
        body.va*=Math.pow(.982,dt*60)
        body.x+=body.vx*dt
        body.y+=body.vy*dt
        body.angle+=body.va*dt*58

        const left=body.w*.38,right=width-body.w*.38
        const top=body.h*.36,bottom=height-body.h*.47
        if(body.x<left){body.x=left;body.vx=Math.abs(body.vx)*.58;body.va+=.18}
        if(body.x>right){body.x=right;body.vx=-Math.abs(body.vx)*.58;body.va-=.18}
        if(body.y<top){body.y=top;body.vy=Math.abs(body.vy)*.38}
        if(body.y>bottom){
          body.y=bottom
          if(body.vy>0)body.vy=-body.vy*.33
          if(Math.abs(body.vy)<22)body.vy=0
          body.vx*=Math.pow(.86,dt*60)
          body.va*=Math.pow(.78,dt*60)
        }
      }

      // Two passes keep the pile solid while still feeling soft and springy.
      for(let pass=0;pass<2;pass++){
        for(let i=0;i<bodies.length;i++){
          for(let j=i+1;j<bodies.length;j++) solvePair(bodies[i],bodies[j])
        }
      }

      for(const body of bodies){
        body.el.style.transform=`translate3d(${body.x-body.w/2}px,${body.y-body.h/2}px,0) rotate(${body.angle}deg)`
      }
      raf=requestAnimationFrame(tick)
    }

    const entrance=gsap.fromTo(nodes.map(n=>n.querySelector('img')),{autoAlpha:0,scale:.72,y:24},{autoAlpha:1,scale:1,y:0,duration:.75,stagger:.035,ease:'back.out(1.35)',delay:.35})
    raf=requestAnimationFrame(tick)

    const resize=new ResizeObserver(()=>{
      const oldW=width||1,oldH=height||1
      const nextW=container.clientWidth,nextH=container.clientHeight
      if(!nextW||!nextH)return
      bodies.forEach(body=>{body.x=body.x/oldW*nextW;body.y=body.y/oldH*nextH})
      measure(false)
    })
    resize.observe(container)

    return()=>{
      running=false
      cancelAnimationFrame(raf)
      resize.disconnect()
      entrance.kill()
      container.removeEventListener('pointermove',onPointerMove)
      container.removeEventListener('pointerleave',onPointerLeave)
      container.removeEventListener('pointerdown',onPointerDown)
    }
  },[objects])

  return <div ref={shell} className="kinetic-pile" aria-label="Interactive 6.STUDIO object collection">
    <div className="kinetic-pile-floor" aria-hidden="true"/>
    {objects.map((object,i)=>{
      const style={
        '--object-size':object.size,
        aspectRatio:String(object.aspect),
      } as CSSProperties
      return <div
        key={object.key}
        ref={el=>{refs.current[i]=el}}
        className="kinetic-object"
        style={style}
        aria-hidden="true"
      ><img src={object.src} alt="" draggable={false}/></div>
    })}
    <div className="kinetic-hint" aria-hidden="true"><span>MOVE THE CURSOR</span><i>objects react to you</i></div>
  </div>
}
