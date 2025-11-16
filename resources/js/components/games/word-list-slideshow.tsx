import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

type WordListSlideshowProps = {
  title?: string
  words: string[]
  onChangeIndex?: (idx: number) => void
  className?: string
  // optional extra control on the right (e.g., Teacher Answer Key button)
  rightAction?: React.ReactNode
}

export default function WordListSlideshow({
  title = "Word List",
  words,
  onChangeIndex,
  className,
  rightAction,
}: WordListSlideshowProps) {
  const [idx, setIdx] = React.useState(0)
  const total = words.length
  const current = words[idx]

  const goPrev = React.useCallback(() => setIdx(i => Math.max(0, i - 1)), [])
  const goNext = React.useCallback(() => setIdx(i => Math.min(total - 1, i + 1)), [total])
  const goTo = (i: number) => setIdx(Math.min(Math.max(i, 0), total - 1))
  const reset = () => setIdx(0)

  // Keyboard navigation
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goPrev, goNext])

  React.useEffect(() => {
    onChangeIndex?.(idx)
  }, [idx, onChangeIndex])

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={reset} title="Start over">
            <RotateCcw className="w-4 h-4" />
          </Button>
          {rightAction}
        </div>
      </div>

      {/* Panel */}
      <Card className="p-6 md:p-8 border-4 border-primary/30 bg-card shadow-xl">
        <header className="mb-6">
          <p className="text-foreground/70 text-sm md:text-base">
            Read the word on each slide. Use the arrows or your keyboard.
          </p>
        </header>

        <div className="flex items-center justify-center gap-6 mb-8">
          {/* Prev */}
          <Button
            onClick={goPrev}
            variant="secondary"
            size="icon"
            disabled={idx === 0}
            aria-label="Previous"
            title="Previous"
            className="rounded-xl w-12 h-12 md:w-16 md:h-16"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </Button>

          {/* Big word */}
          <div
            className={cn(
              "w-[22rem] md:w-[78rem] h-[16rem] md:h-[22rem]",
              "flex items-center justify-center rounded-2xl border shadow-inner",
              "text-6xl md:text-[12rem] font-bold tracking-tight select-none text-center",
              "border-border bg-background"
            )}
            aria-label={`Word ${current}`}
          >
            {current}
          </div>

          {/* Next */}
          <Button
            onClick={goNext}
            size="icon"
            disabled={idx === total - 1}
            aria-label="Next"
            title="Next"
            className="rounded-xl w-12 h-12 md:w-16 md:h-16"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </Button>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="text-sm md:text-base text-foreground/70 font-medium">
            Item <span className="font-semibold">{idx + 1}</span> of {total}
          </div>
          <div className="max-w-full overflow-x-auto">
            <div className="flex items-center gap-1 px-1 py-1">
              {words.map((w, i) => {
                const active = i === idx
                return (
                  <button
                    key={`${w}-${i}`}
                    onClick={() => goTo(i)}
                    aria-label={`Go to ${w} (${i + 1})`}
                    title={w}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-all",
                      active ? "w-6 bg-primary" : "bg-muted hover:bg-muted/80"
                    )}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
