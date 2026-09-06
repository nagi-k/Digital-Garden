import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Cursor from '@/components/layout/Cursor';
import ScrollProgress from '@/components/layout/ScrollProgress';
import Home from '@/pages/Home';
import Portfolio from '@/pages/Portfolio';
import PortfolioDetail from '@/pages/PortfolioDetail';
import Notes from '@/pages/Notes';
import NoteDetail from '@/pages/NoteDetail';
import Interests from '@/pages/Interests';
import About from '@/pages/About';
import Library from '@/pages/Library';
import Uses from '@/pages/Uses';
import Guestbook from '@/pages/Guestbook';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/ui" element={<Portfolio />} />
          <Route path="/ui/:slug" element={<PortfolioDetail />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:slug" element={<NoteDetail />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/library" element={<Library />} />
          <Route path="/about" element={<About />} />
          <Route path="/uses" element={<Uses />} />
          <Route path="/guestbook" element={<Guestbook />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
