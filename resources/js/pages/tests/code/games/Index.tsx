import * as React from "react"
import { useRemember, Head } from "@inertiajs/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  title: string
  columns: [string[], string[]] // two columns
  variant?: "pretest" | "posttest"
}

export default function AnswerKeyIndex({ title, columns, variant = "pretest" }: Props) {
  const flatWords = React.useMemo(() => [...columns[0], ...columns[1]], [columns])
  const rememberKey = React.useMemo(() => `answer-key:${title}:${variant}`, [title, variant])

  const [checked, setChecked] = useRemember<Record<string, boolean>>(
    Object.fromEntries(flatWords.map(w => [w, false])) as Record<string, boolean>,
    rememberKey
  )

  const totalChecked = React.useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  )

  const toggle = (w: string) => setChecked(prev => ({ ...prev, [w]: !prev[w] }))
  const setAll = (val: boolean) =>
    setChecked(Object.fromEntries(flatWords.map(w => [w, val])))

  return (
    <div className="min-h-screen p-6 md:p-10 from-background via-accent/20 to-tertiary/30">
      <Head title={`${title} — Answer Key`} />
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            {title} — Answer Key {variant ? `(${variant})` : null}
          </h1>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setAll(false)} title="Clear">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setAll(true)} title="Select All">
              Select All
            </Button>
          </div>
        </div>

        <Card className="p-6 md:p-8 border-4 border-primary/30 bg-card shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {columns.map((col, colIdx) => (
              <div key={`col-${colIdx}`} className="flex flex-col gap-3">
                {col.map((w) => (
                  <label
                    key={w}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 cursor-pointer select-none",
                      checked[w] ? "border-green-500 bg-green-50" : "border-border bg-background"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={!!checked[w]}
                      onChange={() => toggle(w)}
                    />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tracking-wide">{w}</span>
                      {checked[w] && <Check className="w-4 h-4 text-green-600" />}
                    </div>
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-foreground/60">
            Marked correct: <span className="font-semibold">{totalChecked}</span> / {flatWords.length}
          </div>
        </Card>
      </div>
    </div>
  )
}
