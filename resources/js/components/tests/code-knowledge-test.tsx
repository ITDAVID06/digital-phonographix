// components/tests/code/CodeKnowledgeTest.tsx
import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { COL1, COL2, COL3, STUDENT_ORDER, META, buildMap } from "@/components/tests/code/shared"
import { Link } from "@inertiajs/react"
import { ROUTES } from "@/lib/routes"
import { testsCodeTeacher } from "@/app-routes"

type Props = {
  variant: "pretest" | "posttest"
  onSubmitAll?: (results: import("@/components/tests/code/shared").CodeKnowledgeResult[]) => void | Promise<void>
  className?: string
}

export default function CodeKnowledgeTest({ variant, onSubmitAll, className }: Props) {
    const [knownMap, setKnownMap] = React.useState<Record<string, boolean>>(() => buildMap(STUDENT_ORDER))
    const [idx, setIdx] = React.useState(0)

    const total = STUDENT_ORDER.length
    const current = STUDENT_ORDER[idx]

    const totalKnown = Object.values(knownMap).filter(Boolean).length
    const resetAll = () => setKnownMap(buildMap(STUDENT_ORDER))
    const setOne = (g: string, val: boolean) => setKnownMap((prev) => ({ ...prev, [g]: val }))

    const goPrev = () => setIdx((i) => Math.max(0, i - 1))
    const goNext = () => setIdx((i) => Math.min(total - 1, i + 1))
    const goTo = (i: number) => setIdx(() => Math.min(Math.max(i, 0), total - 1))

    // Keyboard navigation (Left/Right arrows)
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") goPrev()
        if (e.key === "ArrowRight") goNext()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [total])

    // optional save (unchanged)
    const saveAll = async () => {
        if (!onSubmitAll) return
        const now = Date.now()
        const payload = STUDENT_ORDER.map((g) => ({
        variant,
        grapheme: g,
        known: !!knownMap[g],
        examples: META[g] ?? "",
        timestamp: now,
        }))
        await onSubmitAll(payload)
    }

    // find which column the current item belongs to (for subtle label)
    const colLabel =
        (COL1 as readonly string[]).includes(current) ? "Column 1" :
        (COL2 as readonly string[]).includes(current) ? "Column 2" : "Column 3"

    return (
        <div className={cn("space-y-8", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold">Code Knowledge Test</h2>
            <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={resetAll} title="Reset local highlights">
                <RotateCcw className="w-4 h-4" />
            </Button>
            {/* Open teacher view in a new tab */}
            <Button asChild size="sm" title="Open teacher checklist in a new tab">
            <a
                href={`${testsCodeTeacher().url}?variant=${variant}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Teacher: Record knowledge
            </a>
            </Button>
            </div>
        </div>

        {/* Student-facing panel */}
        <Card className="p-6 md:p-8 border-4 border-primary/30 bg-card shadow-xl">
            <header className="mb-6">
            <h3 className="text-xl md:text-2xl font-semibold">Read the letters and letter groups</h3>
            <p className="text-foreground/70 text-sm md:text-base">
                The student reads; the teacher records knowledge in a separate tab.
            </p>
            </header>

            {/* Carousel: single grapheme */}
            <div className="flex items-center justify-center gap-6 mb-8">
            {/* Prev Button */}
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

            {/* Fixed-size display box */}
            <div
                className={cn(
                // Fixed width, generous height
                "w-[22rem] md:w-[78rem] h-[16rem] md:h-[22rem]",
                // Centered content
                "flex items-center justify-center rounded-2xl border shadow-inner",
                // Text scaling + aesthetics
                "text-6xl md:text-[24rem] font-bold tracking-widest select-none text-center",
                // Color logic
                knownMap[current] ? "border-green-500 bg-green-50" : "border-border bg-background"
                )}
                title={META[current] ?? ""}
                aria-label={`Grapheme ${current}`}
            >
                {current}
            </div>

            {/* Next Button */}
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

            {/* Pagination + meta */}
            <div className="flex flex-col items-center gap-2 mb-4">
            <div className="text-sm md:text-base text-foreground/70 font-medium">
                {colLabel} • Item <span className="font-semibold">{idx + 1}</span> of {total}
            </div>

            {/* Dots pagination — scrollable, accessible */}
            <div className="max-w-full overflow-x-auto">
                <div className="flex items-center gap-1 px-1 py-1">
                {STUDENT_ORDER.map((g, i) => {
                    const active = i === idx
                    return (
                    <button
                        key={`dot-${g}-${i}`}
                        onClick={() => goTo(i)}
                        aria-label={`Go to ${g} (${i + 1})`}
                        title={g}
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

            {/* Optional footer status */}
            <div className="text-sm text-foreground/60">
            Marked known (local preview): <span className="font-semibold">{totalKnown}</span> / {total}
            </div>
        </Card>
        </div>
    )
}
