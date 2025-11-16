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
        <div className={cn("space-y-4 sm:space-y-6 md:space-y-8 px-2 sm:px-4", className)}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Code Knowledge Test</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
                size="sm" 
                variant="secondary" 
                onClick={resetAll} 
                title="Reset local highlights"
                className="flex-1 sm:flex-none"
            >
                <RotateCcw className="w-4 h-4 sm:mr-0" />
                <span className="sm:hidden ml-2">Reset</span>
            </Button>
            {/* Open teacher view in a new tab */}
            <Button 
                asChild 
                size="sm" 
                title="Open teacher checklist in a new tab"
                className="flex-1 sm:flex-none text-xs sm:text-sm"
            >
                <a
                    href={`${testsCodeTeacher().url}?variant=${variant}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="hidden sm:inline">Teacher: Record knowledge</span>
                    <span className="sm:hidden">Teacher View</span>
                </a>
            </Button>
            </div>
        </div>

        {/* Student-facing panel */}
        <Card className="p-4 sm:p-6 md:p-8 border-2 sm:border-4 border-primary/30 bg-card shadow-xl">
            <header className="mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">Read the letters and letter groups</h3>
            <p className="text-foreground/70 text-xs sm:text-sm md:text-base mt-1">
                The student reads; the teacher records knowledge in a separate tab.
            </p>
            </header>

            <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4 mb-6 sm:mb-8 w-full min-w-0">
            {/* Prev Button (flex-none so center can shrink) */}
            <Button
                onClick={goPrev}
                variant="secondary"
                size="icon"
                disabled={idx === 0}
                aria-label="Previous"
                title="Previous"
                className="flex-none rounded-lg sm:rounded-xl w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </Button>

              {/* Flexible center box: flex-1  min-w-0 allows it to shrink on narrow screens */}
                <div
                    className={cn(
                    "flex-1 min-w-0 mx-2",
                    "h-[10rem] sm:h-[12rem] md:h-[16rem] lg:h-[20rem] xl:h-[24rem]",
                    "flex items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl border shadow-inner",
                    "text-3xl sm:text-4xl md:text-7xl lg:text-8xl xl:text-[15rem] font-bold tracking-wide select-none text-center",
                    "px-2 sm:px-4 md:px-6",
                    knownMap[current] ? "border-green-500 bg-green-50" : "border-border bg-background",
                    "overflow-hidden"
                    )}
                    title={META[current] ?? ""}
                    aria-label={`Grapheme ${current}`}
                >
                    {/* inner wrapper ensures text truncation and prevents overflow */}
                    <div className="w-full break-words leading-none">
                    {current}
                    </div>
                </div>

                {/* Next Button */}
                <Button
                    onClick={goNext}
                    size="icon"
                    disabled={idx === total - 1}
                    aria-label="Next"
                    title="Next"
                    className="flex-none rounded-lg sm:rounded-xl w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </Button>
            </div>

            {/* Pagination + meta */}
            <div className="flex flex-col items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="text-xs sm:text-sm md:text-base text-foreground/70 font-medium text-center">
                {colLabel} • Item <span className="font-semibold">{idx + 1}</span> of {total}
            </div>

            {/* Dots pagination — scrollable, accessible */}
            <div className="overflow-x-auto w-16 md:w-64 lg:w-128">
                <div className="flex items-center justify-start gap-1 px-2 py-1 w-max">
                {STUDENT_ORDER.map((g, i) => {
                    const active = i === idx
                    return (
                    <button
                        key={`dot-${g}-${i}`}
                        onClick={() => goTo(i)}
                        aria-label={`Go to ${g} (${i + 1})`}
                        title={g}
                        className={cn(
                        "h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all shrink-0",
                        active ? "w-4 sm:w-6 bg-primary" : "bg-muted hover:bg-muted/80"
                        )}
                    />
                    )
                })}
                </div>
            </div>
            </div>

            {/* Optional footer status */}
            <div className="text-xs sm:text-sm text-foreground/60 text-center">
            Marked known (local preview): <span className="font-semibold">{totalKnown}</span> / {total}
            </div>
        </Card>
        </div>
    )
}
