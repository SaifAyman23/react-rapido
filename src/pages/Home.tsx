import { WordRotate } from '@/components/ui/word-rotate'
import { APP_NAME } from '@/lib/constants'
import MagicBento from '@/components/bits/MagicBento'
import MoltenMetal from '@/components/bits/MoltenMetal'


const rotatingWords = ['React 19', 'TypeScript', 'Tailwind v4', 'Zustand', 'React Query']

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <div style={{ width: '100%', height: '100%', position: 'absolute', zIndex: '0' }}>
        <MoltenMetal
          color1="#003FFC"
          color2="#5e00ff"
          color3="#5e00ff"
          speed={0.15}
          scale={4}
          detail={3}
          glow={1.6}
          coreSize={0.1}
          swirl={1}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.3}
          colorMode="molten"
          grain
          grainIntensity={0.05}
          mouseInteraction={false}
          mouseStrength={0.3}
          opacity={1}
        />
      </div>
      <div className=' absolute z-10 inset-0 bg-radial from-background via-background to-transparent '>
      </div>



      <main className="relative mx-auto z-20 max-w-3xl px-6 py-24 text-center flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground">
          {APP_NAME}
        </h1>

        <p className="mt-4 text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
          A modern frontend starter built with{' '}
          <WordRotate words={rotatingWords} className="inline font-semibold text-foreground" />
        </p>

        <div className='my-5'>
          <MagicBento 
            textAutoHide={true}
            enableStars
            enableSpotlight
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect
            spotlightRadius={400}
            particleCount={12}
            glowColor="132, 0, 255"
            disableAnimations={false}
          />
        </div>

        <p className="fixed bottom-10 bg-background rounded-full shadow-sm backdrop-blur-md p-2 text-xs text-muted-foreground">
          Configure via{' '}
          <code className="text-foreground text-xs bg-muted px-1.5 py-0.5 rounded-md">
            VITE_APP_NAME
          </code>{' '}
          and{' '}
          <code className="text-foreground text-xs bg-muted px-1.5 py-0.5 rounded-md">
            VITE_API_URL
          </code>
        </p>
      </main>
    </div>
  )
}
