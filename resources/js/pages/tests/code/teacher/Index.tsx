// resources/js/pages/tests/code/teacher.tsx
import * as React from "react"
import { usePage } from "@inertiajs/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { COL1, COL2, COL3, STUDENT_ORDER, META, buildMap, CodeKnowledgeResult } from "@/components/tests/code/shared"

type Variant = "pretest" | "posttest"

function useVariantFromUrl(defaultValue: Variant = "pretest"): Variant {
  const { url } = usePage() // e.g. "/tests/code/teacher?variant=posttest"
  const qs = url.split("?")[1] ?? ""
  const params = new URLSearchParams(qs)
  const v = params.get("variant")
  return (v === "posttest" ? "posttest" : "pretest") as Variant
}

export default function TeacherCodeIndex() {
    const variantParam = useVariantFromUrl()

    const [knownMap, setKnownMap] = React.useState<Record<string, boolean>>(
        () => buildMap(STUDENT_ORDER)
    )
    const [saving, setSaving] = React.useState(false)

    const totalKnown = Object.values(knownMap).filter(Boolean).length
    const resetAll = () => setKnownMap(buildMap(STUDENT_ORDER))
    const selectAll = () =>
        setKnownMap(
        STUDENT_ORDER.reduce((acc, g) => {
            acc[g] = true
            return acc
        }, {} as Record<string, boolean>)
        )
    const setOne = (g: string, val: boolean) =>
        setKnownMap((prev) => ({ ...prev, [g]: val }))

    const saveAll = async () => {
        const now = Date.now()
        const payload: CodeKnowledgeResult[] = STUDENT_ORDER.map((g) => ({
        variant: variantParam,
        grapheme: g,
        known: !!knownMap[g],
        examples: META[g] ?? "",
        timestamp: now,
        }))
        setSaving(true)
        try {
        // TODO: replace with your API call (e.g., Inertia.post/axios/fetch)
        console.log("code-knowledge saveAll()", payload)
        } finally {
        setSaving(false)
        }
    }

    return (
        <div className="min-h-screen p-6 md:p-10 from-background via-accent/20 to-tertiary/30">
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">
                Teacher View — Code Knowledge ({variantParam})
            </h1>
            <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={resetAll} title="Clear">
                <RotateCcw className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary" onClick={selectAll} title="Select All">
                Select All
                </Button>
                <Button size="sm" onClick={saveAll} disabled={saving}>
                {saving ? "Saving..." : "Save"}
                </Button>
            </div>
            </div>

            <Card className="p-6 md:p-8 border-4 border-primary/30 bg-card shadow-xl">
            <header className="mb-4">
                <h2 className="text-xl md:text-2xl font-semibold">Mark graphemes the student can produce</h2>
                <p className="text-foreground/70 text-sm md:text-base">
                Each item has an example to cue the intended sound(s).
                </p>
            </header>

            {/* 3 columns, vertical stacks mirroring student view */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[COL1, COL2, COL3].map((col, colIdx) => (
                <div key={`col-${colIdx}`} className="flex flex-col gap-3">
                    {col.map((g) => (
                    <label
                        key={`chk-${g}`}
                        className={cn(
                        "flex items-start gap-3 rounded-xl border p-3 cursor-pointer select-none",
                        knownMap[g] ? "border-green-500 bg-green-50" : "border-border bg-background"
                        )}
                    >
                        <input
                        type="checkbox"
                        className="mt-1 h-4 w-4"
                        checked={!!knownMap[g]}
                        onChange={(e) => setOne(g, e.target.checked)}
                        />
                        <div className="min-w-0">
                        <div className="font-semibold tracking-wide">{g}</div>
                        <div className="text-sm text-foreground/70 truncate">{META[g] ?? "—"}</div>
                        </div>
                    </label>
                    ))}
                </div>
                ))}
            </div>

            <div className="mt-4 text-sm text-foreground/60">
                Selected: <span className="font-semibold">{totalKnown}</span> / {STUDENT_ORDER.length}
            </div>
            </Card>
        </div>
        </div>
    )
}
