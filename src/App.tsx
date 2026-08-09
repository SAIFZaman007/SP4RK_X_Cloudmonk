import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MobileDeckBand from './components/MobileDeckBand';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Testimonials from './components/Testimonials';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ScrollProgress from './components/motion/ScrollProgress';

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen">
        <ScrollProgress />
        <Navbar />
        <main className="relative z-10">
          <Hero />
          <MobileDeckBand />
          <About />
          <Services />
          <Projects />
          <Experience />
          <Skills />
          <Testimonials />
          <Education />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </MotionConfig>
  );
}

export default App;
