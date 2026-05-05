import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Films from './pages/Films';
import Law from './pages/Law';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminFilms from './admin/AdminFilms';
import AdminLaw from './admin/AdminLaw';
import AdminGallery from './admin/AdminGallery';
import AdminAbout from './admin/AdminAbout';
import AdminMessages from './admin/AdminMessages';
import AdminSettings from './admin/AdminSettings';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/films" element={<Films />} />
          <Route path="/law" element={<Law />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/films" element={<AdminFilms />} />
          <Route path="/admin/law" element={<AdminLaw />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/about" element={<AdminAbout />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
