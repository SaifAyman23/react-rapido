/* eslint-disable react-refresh/only-export-components */
import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiDjango,
  SiCelery,
  SiRedis,
  SiPostgresql,
  SiMysql,
  SiJsonwebtokens,
  SiFirebase,
  SiReact,
  SiTailwindcss,
  SiTanstack,
  SiFramer,
  SiShadcnui,
  SiGit,
  SiGithub,
  SiDocker,
  SiVercel,
  SiDigitalocean,
  SiFigma,
  SiPostman,
} from 'react-icons/si'

import FlowingMenu from '@/components/bits/FlowingMenu'

export const defaultSkillCategories = [
  {
    title: 'Languages',
    techs: [
      { name: 'Python', Icon: SiPython },
      { name: 'JavaScript', Icon: SiJavascript },
      { name: 'TypeScript', Icon: SiTypescript },
    ],
  },
  {
    title: 'Backend',
    techs: [
      { name: 'Django', Icon: SiDjango },
      { name: 'Celery', Icon: SiCelery },
      { name: 'Redis', Icon: SiRedis },
      { name: 'PostgreSQL', Icon: SiPostgresql },
      { name: 'MySQL', Icon: SiMysql },
      { name: 'JWT', Icon: SiJsonwebtokens },
      { name: 'Firebase Cloud Messaging', Icon: SiFirebase },
    ],
  },
  {
    title: 'Frontend',
    techs: [
      { name: 'React', Icon: SiReact },
      { name: 'TypeScript', Icon: SiTypescript },
      { name: 'Tailwind', Icon: SiTailwindcss },
      { name: 'TanStack Query', Icon: SiTanstack },
      { name: 'Framer Motion', Icon: SiFramer },
      { name: 'ShadCN/ui', Icon: SiShadcnui },
    ],
  },
  {
    title: 'Version Control & Tools',
    techs: [
      { name: 'Git', Icon: SiGit },
      { name: 'GitHub', Icon: SiGithub },
      { name: 'Docker', Icon: SiDocker },
      { name: 'Vercel', Icon: SiVercel },
      { name: 'DigitalOcean', Icon: SiDigitalocean },
      { name: 'Figma', Icon: SiFigma },
      { name: 'Postman', Icon: SiPostman },
      { name: 'Firebase', Icon: SiFirebase },
    ],
  },
]

interface SkillsProps {
  items?: typeof defaultSkillCategories
  eyebrow?: string
  title?: string
  subtitle?: string
}

// const architectureSkills = ['RBAC', 'Real-time Systems', 'WebSockets', 'Performance Optimization', 'System Design', 'Database Design']

export default function Skills({
  items = defaultSkillCategories,
  eyebrow = 'Skills',
  title = 'What I\nWork With',
  subtitle = "Grouped by category. Hover a row to see what's inside.",
}: SkillsProps) {
  return (
    <section className="relative bg-background px-6 pb-32">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="font-heading mt-4 text-[clamp(3rem,9vw,8.5rem)] font-black uppercase leading-[0.9] tracking-tight">
          {title.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground sm:text-2xl">
          {subtitle}
        </p>

        <div className="mt-16 h-[420px] md:h-[520px]">
          <div className="animate-fade-in h-full w-full">
            <FlowingMenu items={items} />
          </div>
        </div>

        {/* <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          <span className="eyebrow mr-3">Architecture</span>
          {architectureSkills.map((skill, i) => (
            <span key={skill}>
              {i > 0 && <span className="mx-2 text-accent-sky/70">·</span>}
              {skill}
            </span>
          ))}
        </p> */}
      </div>
    </section>
  )
}
