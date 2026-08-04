// Parse basic markdown: **bold**, line breaks, bullet points
export function renderMarkdown(text: string) {
  return text.split('\n').map((line, i) => {
    // Bullet points
    if (line.startsWith('- ') || line.startsWith('✅ ')) {
      const content = line.replace(/^[-✅]\s/, '')
      return (
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 opacity-70" />
          <span>{parseBold(content)}</span>
        </div>
      )
    }
    // Bold headers (lines starting with **)
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <p key={i} className="font-semibold text-foreground mt-3 mb-1 first:mt-0">
          {line.replace(/\*\*/g, '')}
        </p>
      )
    }
    // Blockquote (italic/quoted lines starting with >)
    if (line.startsWith('> ')) {
      return (
        <blockquote
          key={i}
          className="border-l-2 border-primary/40 pl-3 italic text-muted-foreground my-1"
        >
          {parseBold(line.slice(2))}
        </blockquote>
      )
    }
    // Empty line = spacer
    if (line.trim() === '') return <div key={i} className="h-2" />
    // Normal line
    return (
      <p key={i} className="leading-relaxed">
        {parseBold(line)}
      </p>
    )
  })
}

function parseBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  )
}
