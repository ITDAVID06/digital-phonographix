// components/tests/blending/BlendingTest.tsx
"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils" // if you have a cn helper; otherwise remove and inline classnames

export type BlendingResult = {
  variant: "pretest" | "posttest"
  part: 1 | 2
  target: string            // the prompted word (e.g., "pig")
  response: string          // what the teacher typed (student’s answer)
  isExactMatch: boolean     // convenient flag (case-insensitive trim)
  timestamp: number         // ms epoch
}

type Props = {
  variant: "pretest" | "posttest"
  onSubmitOne?: (result: BlendingResult) => void | Promise<void>
  onSubmitAll?: (results: BlendingResult[]) => void | Promise<void>
  className?: string
}

const PART_ONE = ["pig", "bug", "hat", "pin", "rat", "bird", "shell", "five", "boat"] as const
const PART_TWO = ["frog", "grass", "stick", "print", "crunch", "plant"] as const

// Utility: display letters with generous tracking
const SpelledOut = ({ word }: { word: string }) => {
    // Show letters with spaces; keep digraphs as-is (we’re not slicing by grapheme cluster here)
    // Example: "pig" => "p i g"; "shell" => "s h e l l"
    const spaced = word.split("").join(" ")
    return (
        <span
        className="font-bold tracking-[.35em] text-2xl md:text-3xl"
        aria-label={`Letters of ${word}`}
        >
        {spaced}
        </span>
    )
}

export default function BlendingTest({ variant, onSubmitOne, onSubmitAll, className }: Props) {
    type RowState = { response: string; submitted?: boolean }

    const [part1, setPart1] = React.useState<Record<(typeof PART_ONE)[number], RowState>>(
        Object.fromEntries(PART_ONE.map((w) => [w, { response: "" }])) as any
    )
    const [part2, setPart2] = React.useState<Record<(typeof PART_TWO)[number], RowState>>(
        Object.fromEntries(PART_TWO.map((w) => [w, { response: "" }])) as any
    )

    const makeResult = (part: 1 | 2, target: string, response: string): BlendingResult => {
        const norm = (s: string) => s.trim().toLowerCase()
        return {
        variant,
        part,
        target,
        response,
        isExactMatch: norm(target) === norm(response),
        timestamp: Date.now(),
        }
    }

    const submitSingle = async (part: 1 | 2, target: string) => {
        const resp =
        part === 1
            ? (part1[target as keyof typeof part1]?.response ?? "")
            : (part2[target as keyof typeof part2]?.response ?? "")
        const result = makeResult(part, target, resp)
        try {
        await onSubmitOne?.(result)
        if (part === 1)
            setPart1((prev) => ({ ...prev, [target]: { ...prev[target as keyof typeof prev], submitted: true } }))
        else
            setPart2((prev) => ({ ...prev, [target]: { ...prev[target as keyof typeof prev], submitted: true } }))
        } catch {
        // Swallow; you can show a toast/snackbar here
        }
    }

    const submitAll = async () => {
        const results: BlendingResult[] = [
        ...PART_ONE.map((w) => makeResult(1, w, part1[w].response)),
        ...PART_TWO.map((w) => makeResult(2, w, part2[w].response)),
        ]
        try {
        await onSubmitAll?.(results)
        setPart1((prev) =>
            Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, { ...v, submitted: true }])) as any
        )
        setPart2((prev) =>
            Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, { ...v, submitted: true }])) as any
        )
        } catch {
        // Swallow; you can show a toast/snackbar here
        }
    }

    const resetAll = () => {
        setPart1(Object.fromEntries(PART_ONE.map((w) => [w, { response: "" }])) as any)
        setPart2(Object.fromEntries(PART_TWO.map((w) => [w, { response: "" }])) as any)
    }

    return (
        <div className={cn("space-y-8", className)}>
        {/* Header with shared buttons */}
        <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold">Blending Test</h2>
            <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={resetAll} title="Reset all">
                <RotateCcw className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={submitAll} title="Submit all responses">
                Submit All
            </Button>
            </div>
        </div>

        {/* Grid layout for parts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* PART ONE */}
            <Card className="p-6 md:p-8 border-4 border-primary/30 bg-card shadow-xl h-full flex flex-col">
            <header className="mb-4">
                <h3 className="text-xl md:text-2xl font-semibold">Part One</h3>
            </header>

            <ol className="space-y-3 flex-1">
                {PART_ONE.map((w, idx) => {
                const row = part1[w]
                const exact = row.response.trim().length > 0
                    ? row.response.trim().toLowerCase() === w
                    : null
                return (
                    <li key={w} className="grid grid-cols-1 md:grid-cols-[1fr,auto] items-center gap-3">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-baseline justify-between">
                        <div className="text-foreground/80">
                            <span className="mr-3 text-sm font-medium text-foreground/60">#{idx + 1}</span>
                            <SpelledOut word={w} />
                        </div>
                        {row.submitted && (
                            <span className={cn("text-xs font-semibold", exact ? "text-green-600" : "text-red-600")}>
                            {exact ? "match" : "no match"}
                            </span>
                        )}
                        </div>
                        <label className="sr-only" htmlFor={`p1-${w}`}>Student response for {w}</label>
                        <input
                        id={`p1-${w}`}
                        value={row.response}
                        onChange={(e) => setPart1((prev) => ({ ...prev, [w]: { response: e.target.value } }))}
                        placeholder="Teacher enters the student's word"
                        className="rounded-lg border px-3 py-2 bg-background"
                        autoComplete="off"
                        inputMode="text"
                        />
                    </div>

                    <div className="flex md:justify-end">
                        <Button
                        onClick={() => submitSingle(1, w)}
                        disabled={row.response.trim().length === 0}
                        className="min-w-28"
                        >
                        Submit
                        </Button>
                    </div>
                    </li>
                )
                })}
            </ol>
            </Card>

            {/* PART TWO */}
            <Card className="p-6 md:p-8 border-4 border-primary/30 bg-card shadow-xl h-full flex flex-col">
            <header className="mb-4">
                <h3 className="text-xl md:text-2xl font-semibold">Part Two</h3>
            </header>

            <ol className="space-y-3 flex-1">
                {PART_TWO.map((w, idx) => {
                const row = part2[w]
                const exact = row.response.trim().length > 0
                    ? row.response.trim().toLowerCase() === w
                    : null
                return (
                    <li key={w} className="grid grid-cols-1 md:grid-cols-[1fr,auto] items-center gap-3">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-baseline justify-between">
                        <div className="text-foreground/80">
                            <span className="mr-3 text-sm font-medium text-foreground/60">#{idx + 1}</span>
                            <SpelledOut word={w} />
                        </div>
                        {row.submitted && (
                            <span className={cn("text-xs font-semibold", exact ? "text-green-600" : "text-red-600")}>
                            {exact ? "match" : "no match"}
                            </span>
                        )}
                        </div>
                        <label className="sr-only" htmlFor={`p2-${w}`}>Student response for {w}</label>
                        <input
                        id={`p2-${w}`}
                        value={row.response}
                        onChange={(e) => setPart2((prev) => ({ ...prev, [w]: { response: e.target.value } }))}
                        placeholder="Teacher enters the student's word"
                        className="rounded-lg border px-3 py-2 bg-background"
                        autoComplete="off"
                        inputMode="text"
                        />
                    </div>

                    <div className="flex md:justify-end">
                        <Button
                        onClick={() => submitSingle(2, w)}
                        disabled={row.response.trim().length === 0}
                        className="min-w-28"
                        >
                        Submit
                        </Button>
                    </div>
                    </li>
                )
                })}
            </ol>
            </Card>
        </div>
        </div>
    )
}
