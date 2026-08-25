/* eslint-disable react-refresh/only-export-components */
import AccordionGallery, { type AccordionGalleryItem } from '../bits/AccordionGallery'

import g1 from '@/assets/img/gallery/1.webp'
import g2 from '@/assets/img/gallery/2.webp'
import g3 from '@/assets/img/gallery/3.webp'
import g4 from '@/assets/img/gallery/4.webp'
import g5 from '@/assets/img/gallery/5.webp'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'

export const defaultGalleryItems: AccordionGalleryItem[] = [
  { image: g1 },
  { image: g2 },
  { image: g3 },
  { image: g4 },
  { image: g5 },
]

interface GalleryProps {
  className?: string
  items?: AccordionGalleryItem[]
  eyebrow?: string
  title?: string
}

export default function Gallery({
  className,
  items = defaultGalleryItems,
  eyebrow = 'Gallery',
  title = 'Through my lens',
}: GalleryProps) {
  const isMobile = useIsMobile(767)

  return (
    <section className={cn('relative overflow-hidden bg-background px-6 pb-36', className)}>
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow text-center">{eyebrow}</p>
        <h2 className="font-libertine my-8 mb-16 text-center text-[clamp(3rem,8vw,7.5rem)] italic leading-[1.05] tracking-tight text-foreground">
          {title}
        </h2>

        <div className="animate-fade-in h-[420px] w-full md:h-[460px]">
          <AccordionGallery
            items={items}
            enabled
            defaultIndex={2}
            expandRatio={0.52}
            trigger={isMobile ? 'click' : 'hover'}
            accentColor="#ffffff"
            overlayColor="#000000"
            textColor="#ffffff"
            grayscale
            showLabels={false}
            duration={0.6}
            ease="power3.out"
            parallax={0.5}
            tilt={8}
            stagger={0.06}
            height={isMobile ? 320 : 460}
            gap={isMobile ? 6 : 10}
            radius={16}
            orientation={isMobile ? 'vertical' : 'horizontal'}
          />
        </div>
      </div>
    </section>
  )
}
