// components/tests/segmentation/PhonemeSegmentationTest.tsx
"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils" // if you don't have cn, remove and inline classNames

export type PhonemeSegmentationResult = {
    variant: "pretest" | "posttest"
    part: 1 | 2
    target: string                 // prompted word (e.g., "dog")
    perLetterCorrect: boolean[]    // one checkbox per position (length === target.length)
    soundedCount: number           // number of true values
    totalLetters: number           // target.length
    accuracyPct: number            // soundedCount / totalLetters * 100
    isPerfect: boolean             // all letters ticked
    timestamp: number              // ms epoch
}

type Props = {
    variant: "pretest" | "posttest"
    onSubmitOne?: (result: PhonemeSegmentationResult) => void | Promise<void>
    onSubmitAll?: (results: PhonemeSegmentationResult[]) => void | Promise<void>
    className?: string
}

const PART_ONE = ["dog", "hat", "pin", "pot", "rat", "nut"] as const
const PART_TWO = ["frog", "black", "nest", "trip", "hand", "drum"] as const
const PART_THREE = ["pim", "mif", "sep", "prif", "sept"] as const

// Wide-tracking display (letters spaced visually for the prompt)
const SpelledOut = ({ word }: { word: string }) => {
    const spaced = word.split("").join(" ")
    return (
        <span className="font-bold tracking-[.35em] text-2xl md:text-3xl" aria-label={`Letters of ${word}`}>
        {spaced}
        </span>
    )
}

type RowState = { perLetter: boolean[]; submitted?: boolean }

const buildMap = <T extends readonly string[]>(items: T) =>
    items.reduce((acc, w) => {
        acc[w as T[number]] = { perLetter: Array.from({ length: w.length }, () => false) }
        return acc
    }, {} as Record<T[number], RowState>)

    export default function PhonemeSegmentationTest({ variant, onSubmitOne, onSubmitAll, className }: Props) {
    const [part1, setPart1] = React.useState<Record<(typeof PART_ONE)[number], RowState>>(
        () => buildMap(PART_ONE)
    )
    const [part2, setPart2] = React.useState<Record<(typeof PART_TWO)[number], RowState>>(
        () => buildMap(PART_TWO)
    )

    const [part3, setPart3] = React.useState<Record<(typeof PART_THREE)[number], RowState>>(
        () => buildMap(PART_THREE)
    )

    const [saving, setSaving] = React.useState<Record<string, boolean>>({}) // key: `${part}:${word}`

    const makeResult = (part: 1 | 2, target: string, perLetter: boolean[]): PhonemeSegmentationResult => {
        const total = perLetter.length
        const soundedCount = perLetter.filter(Boolean).length
        const isPerfect = soundedCount === total
        const accuracyPct = total === 0 ? 0 : Math.round((soundedCount / total) * 100)
        return {
        variant,
        part,
        target,
        perLetterCorrect: perLetter,
        soundedCount,
        totalLetters: total,
        accuracyPct,
        isPerfect,
        timestamp: Date.now(),
        }
    }

    const submitSingle = async (part: 1 | 2, target: string) => {
        const key = `${part}:${target}`
        const perLetter =
        part === 1
            ? part1[target as keyof typeof part1].perLetter
            : part2[target as keyof typeof part2].perLetter
        const result = makeResult(part, target, perLetter)
        setSaving((s) => ({ ...s, [key]: true }))
        try {
        await onSubmitOne?.(result)
        if (part === 1) {
            setPart1((prev) => ({ ...prev, [target]: { ...prev[target as keyof typeof prev], submitted: true } }))
        } else {
            setPart2((prev) => ({ ...prev, [target]: { ...prev[target as keyof typeof prev], submitted: true } }))
        }
        } finally {
        setSaving((s) => ({ ...s, [key]: false }))
        }
    }

    const submitAll = async () => {
        const results: PhonemeSegmentationResult[] = [
        ...PART_ONE.map((w) => makeResult(1, w, part1[w].perLetter)),
        ...PART_TWO.map((w) => makeResult(2, w, part2[w].perLetter)),
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
        // no-op; hook your toast/snackbar here
        }
    }

    const resetAll = () => {
        setPart1(buildMap(PART_ONE))
        setPart2(buildMap(PART_TWO))
    }

    const filledCount =
        PART_ONE.reduce((n, w) => n + part1[w].perLetter.filter(Boolean).length, 0) +
        PART_TWO.reduce((n, w) => n + part2[w].perLetter.filter(Boolean).length, 0)

    const renderRow = (part: 1 | 2, w: string, idx: number, state: RowState, update: (next: RowState) => void) => {
        const { perLetter, submitted } = state
        const keyBase = `${part}:${w}`
        const exact = perLetter.every(Boolean) // all letters sounded correctly
        const setTick = (i: number, val: boolean) => {
        const next = [...perLetter]
        next[i] = val
        update({ perLetter: next, submitted })
        }
        const toggleTick = (i: number) => setTick(i, !perLetter[i])

        return (
        <li key={w} className="grid grid-cols-1 md:grid-cols-[1fr,auto] items-center gap-3">
            <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
                <div className="text-foreground/80">
                <span className="mr-3 text-sm font-medium text-foreground/60">#{idx + 1}</span>
                <SpelledOut word={w} />
                </div>
                {submitted && (
                <span
                    aria-live="polite"
                    className={cn("text-xs font-semibold", exact ? "text-green-600" : "text-red-600")}
                >
                    {exact ? "perfect" : "partial"}
                </span>
                )}
            </div>

            {/* Checkboxes mapped to each letter position */}
            <div className="flex flex-wrap gap-2 mt-1">
                {w.split("").map((letter, i) => (
                <label
                    key={`${w}-${i}`}
                    className={cn(
                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer select-none",
                    perLetter[i] ? "border-green-500 bg-green-50" : "border-border bg-background"
                    )}
                    title={`Letter ${i + 1}: ${letter}`}
                >
                    <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={perLetter[i]}
                    onChange={() => toggleTick(i)}
                    />
                    <span className="font-semibold tracking-widest">{letter}</span>
                </label>
                ))}
            </div>
            </div>

            <div className="flex md:justify-end">
            <Button
                onClick={() => submitSingle(part, w)}
                disabled={saving[`${part}:${w}`] === true}
                className="min-w-28"
            >
                {saving[`${part}:${w}`] ? "Saving..." : "Submit"}
            </Button>
            </div>
        </li>
        )
    }

    return (
        <div className={cn("space-y-8", className)}>
        {/* Header with shared buttons */}
        <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold">Phoneme Segmentation Test</h2>
            <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={resetAll} title="Reset all">
                <RotateCcw className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={submitAll} title="Submit all responses" disabled={filledCount === 0}>
                Submit All{filledCount ? ` (${filledCount})` : ""}
            </Button>
            </div>
        </div>

        {/* Two-part grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* PART ONE */}
            <Card className="p-6 md:p-8 border-4 border-primary/30 bg-card shadow-xl h-full flex flex-col">
            <header className="mb-4">
                <h3 className="text-xl md:text-2xl font-semibold">Part One</h3>
            </header>

            <ol className="space-y-3 flex-1">
                {PART_ONE.map((w, idx) =>
                renderRow(
                    1,
                    w,
                    idx,
                    part1[w],
                    (next) => setPart1((prev) => ({ ...prev, [w]: next }))
                )
                )}
            </ol>
            </Card>

            {/* PART TWO */}
            <Card className="p-6 md:p-8 border-4 border-primary/30 bg-card shadow-xl h-full flex flex-col">
            <header className="mb-4">
                <h3 className="text-xl md:text-2xl font-semibold">Part Two</h3>
            </header>

            <ol className="space-y-3 flex-1">
                {PART_TWO.map((w, idx) =>
                renderRow(
                    2,
                    w,
                    idx,
                    part2[w],
                    (next) => setPart2((prev) => ({ ...prev, [w]: next }))
                )
                )}
            </ol>
            </Card>

            
            {/* PART THREE */}
            <Card className="p-6 md:p-8 border-4 border-primary/30 bg-card shadow-xl h-full flex flex-col">
            <header className="mb-4">
                <h3 className="text-xl md:text-2xl font-semibold">Part Three</h3>
            </header>

            <ol className="space-y-3 flex-1">
                {PART_THREE.map((w, idx) =>
                renderRow(
                    2,
                    w,
                    idx,
                    part3[w],
                    (next) => setPart3((prev) => ({ ...prev, [w]: next }))
                )
                )}
            </ol>
            </Card>
        </div>
        </div>
    )
}
