import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import Home from './components/Home.jsx'
import './index.css'
import App from './App.jsx'
// import TestHome_fixed from './components/TestHome_fixed.jsx'
import Home3 from './components/Home3.jsx'
import TestHome from './components/TestHome.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <TestHome /> */}
    <Home3 />
    {/* <TestHome_fixed /> */}
    {/* <Home /> */}
  </StrictMode>,
)
