import About from '@/components/home/About'
import Experience from '@/components/home/Experience'
import Footer from '@/components/home/Footer'
import Gallery from '@/components/home/Gallery'
import Hero from '@/components/home/Hero'
import Projects from '@/components/home/Projects'
import Skills from '@/components/home/Skills'
import ThemeToggle from '@/components/theme/ThemeToggle'

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-background">
      <Hero />
      <Experience />
      <Skills />
      <Projects />
      <About />
      <Gallery />
      <Footer />
      <ThemeToggle />
    </div>
  )
}
