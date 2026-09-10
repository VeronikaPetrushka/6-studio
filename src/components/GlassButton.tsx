import type { ButtonHTMLAttributes } from 'react'
export function GlassButton({className='',children,...props}:ButtonHTMLAttributes<HTMLButtonElement>){
  return <button className={`glass-button ${className}`} {...props}><span>{children}</span><i aria-hidden="true"/></button>
}
