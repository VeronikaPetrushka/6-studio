import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { MotionController } from './Motion'
import { CustomCursor } from './CustomCursor'
export function Layout(){return <><Header/><MotionController/><CustomCursor/><main><Outlet/></main><footer className="footer"><div className="footer-six">6.</div><div><b>6.STUDIO</b><p>objects · dishes · candles</p></div><div><a href="https://www.instagram.com/6.studio_ua" target="_blank" rel="noreferrer">Instagram ↗</a><a href="/admin">Admin</a></div><small>© 2026 · Kyiv, Ukraine</small></footer></>}
