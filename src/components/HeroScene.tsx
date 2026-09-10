import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, Environment } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function Sculpture(){
 const group=useRef<THREE.Group>(null)
 useFrame((state,delta)=>{
   if(!group.current)return
   group.current.rotation.y += delta*.09
   group.current.rotation.x=THREE.MathUtils.lerp(group.current.rotation.x,state.pointer.y*.12,.04)
   group.current.rotation.z=THREE.MathUtils.lerp(group.current.rotation.z,-state.pointer.x*.1,.04)
 })
 return <group ref={group}>
   <Float speed={1.2} rotationIntensity={.35} floatIntensity={.7}>
     <mesh rotation={[Math.PI/2,.2,.15]} scale={1.45}>
       <torusGeometry args={[1.2,.27,64,180]}/>
       <MeshTransmissionMaterial thickness={.75} roughness={.08} transmission={1} ior={1.28} chromaticAberration={.08} color="#d7c4b7" backside/>
     </mesh>
     <mesh position={[.22,.04,.1]} scale={.75}>
       <icosahedronGeometry args={[1,5]}/>
       <meshPhysicalMaterial color="#9d806e" metalness={1} roughness={.12} clearcoat={1}/>
     </mesh>
     <mesh position={[-1.22,.78,.2]} scale={.27}>
       <sphereGeometry args={[1,48,48]}/><meshPhysicalMaterial color="#7b1e2c" metalness={.82} roughness={.16}/>
     </mesh>
   </Float>
 </group>
}

export function HeroScene(){
 return <div className="hero-scene" aria-hidden="true"><Canvas camera={{position:[0,0,5],fov:42}} dpr={[1,1.7]} gl={{alpha:true,antialias:true}}>
   <ambientLight intensity={1.3}/><directionalLight position={[4,4,3]} intensity={4}/><pointLight position={[-3,-2,3]} intensity={5} color="#6b1730"/>
   <Sculpture/><Environment preset="studio"/>
 </Canvas></div>
}
