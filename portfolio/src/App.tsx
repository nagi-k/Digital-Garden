import { HashRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { ContentProvider } from './context/ContentContext';
import About from './pages/About';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import Home from './pages/Home';
import WorkDetail from './pages/WorkDetail';
import Works from './pages/Works';

/**
 * 使用 HashRouter：打包后直接部署到任意静态托管（腾讯云 COS / GitHub Pages / Vercel）
 * 都能正常工作，无需服务端 rewrite 配置。
 */
export default function App() {
  return (
    <ContentProvider>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/works" element={<Works />} />
              <Route path="/works/:id" element={<WorkDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </ContentProvider>
  );
}
