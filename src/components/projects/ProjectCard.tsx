import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeImage } from '@/components/ui/FadeImage'

interface ProjectCardProps {
  eyebrow?: string
  title: string
  description: string
  tags: readonly string[]
  image?: string
  href?: string
  className?: string
}

export function ProjectCard({
  eyebrow,
  title,
  description,
  tags,
  image,
  href,
  className,
}: ProjectCardProps) {
  const content = (
    <Card
      className={`
        flex
        w-full
        flex-col
        overflow-hidden
        border-3
        border-black
        bg-card

        ${className ?? ''}

        md:flex-row
        md:items-stretch
      `.trim()}
    >
      {/* Image */}
      <div
        className="
          relative
          mx-4
          mt-4
          aspect-[4/3]
          shrink-0
          overflow-hidden
          rounded-2xl
          bg-muted

          sm:mx-5
          sm:mt-5
          sm:aspect-[16/10]

          md:my-4
          md:ms-8
          md:me-0
          md:aspect-auto
          md:w-[calc(50%-1.5rem)]
        "
      >
        {image ? (
          <FadeImage
            src={image}
            alt=""
            width={900}
            height={871}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center p-6 text-sm text-muted-foreground">
            Image
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          px-5
          py-5

          sm:px-6
          sm:py-6

          md:w-1/2
          md:px-7
          md:py-8

          lg:px-10
          lg:py-10
        "
      >
        <CardHeader className="p-0">
          {eyebrow ? <p className="eyebrow text-accent-sky">{eyebrow}</p> : null}

          <CardTitle
            className="
              font-heading
              mt-3
              text-3xl
              tracking-tight

              sm:text-4xl
              md:text-4xl
            "
          >
            {title}
          </CardTitle>

          <CardDescription
            className="
              font-body
              mt-4
              text-base
              leading-relaxed

              sm:text-lg
              lg:text-xl
            "
          >
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-6 p-0 md:mt-auto md:pt-8">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="
                  border-transparent
                  bg-muted
                  px-2.5
                  py-1
                  font-body
                  text-xs
                  font-medium
                  text-muted-foreground

                  sm:px-3
                  sm:text-sm
                "
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="
          block
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
          focus-visible:ring-offset-2
        "
      >
        {content}
      </a>
    )
  }

  return content
}
