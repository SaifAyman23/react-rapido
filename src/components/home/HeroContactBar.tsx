import { File, Github, Linkedin, Mail } from 'lucide-react'

import { CONTACT } from '@/lib/constants'

const classes =
  'flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition duration-300 hover:bg-white/20'

export default function HeroContactBar() {
  const hasEmail = CONTACT.email !== ''
  const hasGithub = CONTACT.github !== ''
  const hasLinkedin = CONTACT.linkedin !== ''

  if (!hasEmail && !hasGithub && !hasLinkedin) return null

  return (
    <div className="absolute inset-x-0 top-0 z-30 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-4 sm:justify-between md:px-12">
      <div className="flex items-center text-sm text-white/85">
        {hasEmail && (
          <a href={`mailto:${CONTACT.email}`} className={classes}>
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>{CONTACT.email}</span>
          </a>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {hasGithub && (
          <a href={CONTACT.github} target="_blank" rel="noreferrer" className={classes}>
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
        )}
        {hasLinkedin && (
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className={classes}>
            <Linkedin className="h-4 w-4" aria-hidden="true" />
            LinkedIn
          </a>
        )}
        <a
          href={
            'https://drive.google.com/file/d/1OpzN5YNosHrEHZgwcRois3GUPISZ9ktk/view?usp=sharing'
          }
          target="_blank"
          rel="noreferrer"
          className={classes}
        >
          <File className="h-4 w-4" aria-hidden="true" />
          Resume
        </a>
      </div>
    </div>
  )
}
