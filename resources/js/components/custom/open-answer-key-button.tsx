import { Button } from "@/components/ui/button"
import { testsGamesAnswerKey } from "@/app-routes"

function slugForGame(name: string): string | null {
  const n = name.toLowerCase()
  if (n.includes("fat cat")) return "fat-cat-sat"
  if (n.includes("bug on jug")) return "bug-on-jug"
  if (n.includes("ben bun")) return "ben-bun"
  return null
}

export function OpenAnswerKeyButton({ gameName }: { gameName: string }) {
  const slug = slugForGame(gameName)
  if (!slug) return null

  const href = `${testsGamesAnswerKey().url}?game=${encodeURIComponent(slug)}`
  return (
    <Button asChild size="sm" title="Open teacher answer key in a new tab">
      <a href={href} target="_blank" rel="noopener noreferrer">
        Open Answer Key
      </a>
    </Button>
  )
}
