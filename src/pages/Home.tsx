import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Work } from '@/sections/Work'
import { Experience } from '@/sections/Experience'
import { Skills } from '@/sections/Skills'
import { Honours } from '@/sections/Honours'
import { Life } from '@/sections/Life'
import { Contact } from '@/sections/Contact'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

export default function Home() {
  useDocumentTitle('Sivakumar Ramakrishnan | Applied AI Engineer')
  return (
    <main>
      <Hero />
      <About />
      <Work />
      <Experience />
      <Skills />
      <Honours />
      <Life />
      <Contact />
    </main>
  )
}
