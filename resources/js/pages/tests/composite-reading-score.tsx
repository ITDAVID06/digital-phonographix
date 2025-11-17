"use client";

import * as React from "react";
import { usePage, Link } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ChevronLeft } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Variant = "pretest" | "posttest";

type Grade = {
  id: number;
  name: string;
  multiplier: number;
} | null;

type PageProps = {
  variant: Variant;
  student: { id: number; name: string };
  scores: {
    blending: number;
    segmenting: number;
    auditory: number;
    code: number;
    total: number;
    average: number;
  };
  grade: Grade;
  gradeComposite: number;
};

const fmt = (n: number) => {
    return Number(n).toFixed(2);
};

export default function CompositeReadingScore() {
    const { variant, student, scores, grade, gradeComposite } = usePage<PageProps>().props;

    const title =
        variant === "pretest"
        ? "Pre-test Composite Reading Score"
        : "Post-test Composite Reading Score";

    const tests = [
        { label: "Blending Test", value: scores.blending },
        { label: "Segmenting Test", value: scores.segmenting },
        { label: "Auditory Processing Test", value: scores.auditory },
        { label: "Code Knowledge Test", value: scores.code },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-tertiary/30 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
                <Link href={ROUTES.DASHBOARD}>
                <Button variant="outline" size="sm">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                </Button>
                </Link>
                <Button
                variant="secondary"
                size="sm"
                onClick={() => window.history.back()}
                >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Tests
                </Button>
            </div>

            <div className="text-right">
                <p className="text-xs text-foreground/60 uppercase tracking-wide">
                {variant === "pretest" ? "Baseline" : "Follow-up"}
                </p>
            </div>
            </div>

            {/* Title + student */}
            <header className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {title}
            </h1>
            <p className="text-lg md:text-xl font-semibold text-pink-600">
                Student: {student.name}
            </p>
            </header>

            {/* Scores grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {tests.map((t) => (
                <Card
                key={t.label}
                className={cn(
                    "p-4 md:p-6 border-2 border-primary/20 shadow-sm",
                    t.value === 0 && "opacity-70"
                )}
                >
                <p className="text-sm uppercase tracking-wide text-foreground/60 mb-1">
                    {t.label}
                </p>
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                    {fmt(t.value)}
                </p>
                {t.value === 0 && (
                    <p className="text-xs text-foreground/50 mt-1">
                    No score recorded yet.
                    </p>
                )}
                </Card>
            ))}
            </div>

            {/* Totals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="p-4 md:p-6 border-2 border-primary/30">
                <p className="text-sm uppercase tracking-wide text-foreground/60 mb-1">
                Total of Four Tests
                </p>
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                {fmt(scores.total)}
                </p>
                <p className="text-xs text-foreground/50 mt-1">
                Sum of Blending, Segmenting, Auditory, Code.
                </p>
            </Card>

            <Card className="p-4 md:p-6 border-2 border-primary/30">
                <p className="text-sm uppercase tracking-wide text-foreground/60 mb-1">
                Composite Reading Score
                </p>
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                {fmt(scores.average)}
                </p>
                <p className="text-xs text-foreground/50 mt-1">
                Total score ÷ 4.
                </p>
            </Card>

            <Card className="p-4 md:p-6 border-2 border-primary/30">
                <p className="text-sm uppercase tracking-wide text-foreground/60 mb-1">
                Grade-Adjusted Composite
                </p>
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                {fmt(gradeComposite)}
                </p>
                <p className="text-xs text-foreground/50 mt-1">
                Composite × grade multiplier
                {grade && (
                    <>
                    {" "}
                    (<span className="font-semibold">{grade.name}</span> × {grade.multiplier})
                    </>
                )}
                </p>
            </Card>
            </div>
        </div>
        </div>
    );
}
