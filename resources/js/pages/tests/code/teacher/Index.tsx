// resources/js/pages/tests/code/teacher.tsx
"use client";

import * as React from "react";
import { router, usePage } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  COL1,
  COL2,
  COL3,
  STUDENT_ORDER,
  META,
  buildMap,
  CodeKnowledgeResult,
} from "@/components/tests/code/shared";

type Variant = "pretest" | "posttest";

function useVariantFromUrl(defaultValue: Variant = "pretest"): Variant {
  const { url } = usePage(); // e.g. "/tests/code/teacher?variant=posttest"
  const qs = url.split("?")[1] ?? "";
  const params = new URLSearchParams(qs);
  const v = params.get("variant");
  return (v === "posttest" ? "posttest" : "pretest") as Variant;
}

export default function TeacherCodeIndex() {
  const variantParam = useVariantFromUrl();
  const { student } = usePage().props as any; // student from backend

  const [knownMap, setKnownMap] = React.useState<Record<string, boolean>>(
    () => buildMap(STUDENT_ORDER)
  );
  const [saving, setSaving] = React.useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState<{
    totalKnown: number;
    totalItems: number;
  }>({
    totalKnown: 0,
    totalItems: STUDENT_ORDER.length,
  });

  const totalKnown = Object.values(knownMap).filter(Boolean).length;
  const totalItems = STUDENT_ORDER.length;

  const resetAll = () => setKnownMap(buildMap(STUDENT_ORDER));
  const selectAll = () =>
    setKnownMap(
      STUDENT_ORDER.reduce((acc, g) => {
        acc[g] = true;
        return acc;
      }, {} as Record<string, boolean>)
    );
  const setOne = (g: string, val: boolean) =>
    setKnownMap((prev) => ({ ...prev, [g]: val }));

  const saveAll = () => {
    if (!student) {
      console.error("No student found in props");
      return;
    }

    const now = Date.now();
    const payload: CodeKnowledgeResult[] = STUDENT_ORDER.map((g) => ({
      variant: variantParam,
      grapheme: g,
      known: !!knownMap[g],
      examples: META[g] ?? "",
      timestamp: now,
    }));

    setSaving(true);

    router.post(
      "/tests/code-knowledge",
      {
        variant: variantParam,
        student_id: student.id,
        results: payload,
      },
      {
        preserveScroll: true,
        onFinish: () => setSaving(false),
        onSuccess: () => {
          console.log("Code knowledge test saved successfully");
          setModalData({
            totalKnown,
            totalItems,
          });
          setIsModalOpen(true);
        },
        onError: (errors) => {
          console.error("Error saving code knowledge test:", errors);
          // Optional: you can show an error modal instead, but keeping alert here is fine
          alert("Error saving code knowledge test. Check console for details.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen p-6 md:p-10 from-background via-accent/20 to-tertiary/30 relative">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Teacher View — Code Knowledge ({variantParam})
            </h1>
            {student && (
              <p className="text-sm md:text-base text-pink-600 font-semibold">
                Student: {student.name}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={resetAll}
              title="Clear"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={selectAll}
              title="Select All"
            >
              Select All
            </Button>
            <Button size="sm" onClick={saveAll} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <Card className="p-6 md:p-8 border-4 border-primary/30 bg-card shadow-xl">
          <header className="mb-4">
            <h2 className="text-xl md:text-2xl font-semibold">
              Mark graphemes the student can produce
            </h2>
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
                      knownMap[g]
                        ? "border-green-500 bg-green-50"
                        : "border-border bg-background"
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
                      <div className="text-sm text-foreground/70 truncate">
                        {META[g] ?? "—"}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-foreground/60">
            Selected:{" "}
            <span className="font-semibold">
              {totalKnown}
            </span>{" "}
            / {totalItems}
          </div>
        </Card>
      </div>

      {/* ✅ Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <Card className="w-full max-w-md p-6 md:p-8 bg-card shadow-2xl border-2 border-primary/40 relative">
            <button
              className="absolute top-3 right-3 text-foreground/50 hover:text-foreground transition"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-1">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>

              <h2 className="text-xl md:text-2xl font-bold">
                Code Knowledge Saved
              </h2>

              {student && (
                <p className="text-sm md:text-base text-foreground/80">
                  Scores recorded for{" "}
                  <span className="font-semibold">{student.name}</span> (
                  {variantParam}).
                </p>
              )}

              <div className="w-full mt-2 space-y-2">
                <div className="flex items-center justify-between text-sm md:text-base">
                  <span className="text-foreground/70">Known graphemes</span>
                  <span className="font-semibold">
                    {modalData.totalKnown} / {modalData.totalItems}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
