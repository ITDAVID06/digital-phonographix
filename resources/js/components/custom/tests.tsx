"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import BlendingTest, { BlendingResult } from "@/components/tests/blending-test";
import PhonemeSegmentationTest, {
  PhonemeSegmentationResult,
} from "@/components/tests/phoneme-segmentation-test";
import AuditoryProcessingTest, {
  AuditoryProcessingResult,
} from "@/components/tests/auditory-processing-test";
import CodeKnowledgeTest from "@/components/tests/code-knowledge-test";
import { CodeKnowledgeResult } from "@/components/tests/code/shared";
import { Link, router, usePage } from "@inertiajs/react";
import { ROUTES } from "@/lib/routes";

type TestsVariant = "pretest" | "posttest";

type TestItem = {
  name: string;
  description: string;
};

const TEST_ITEMS: TestItem[] = [
  {
    name: "Blending Test",
    description: "Blend phonemes into words (e.g., c-a-t → cat).",
  },
  {
    name: "Phoneme Segmentation Test",
    description: "Segment words into phonemes (e.g., map → /m/ /a/ /p/).",
  },
  {
    name: "Auditory Processing Test",
    description: "Judge whether a 3-letter sequence is a real word sound.",
  },
  {
    name: "Code Knowledge Test",
    description: "Match letters to sounds and basic graphemes.",
  },
];

type ScoreModalState = {
  testName: string;
  raw: number;
  max: number;
} | null;

export default function Tests({ variant }: { variant: TestsVariant }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [expanded, setExpanded] = React.useState(true);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // For the simple “toy” checks you had before
  const [segmentInput, setSegmentInput] = React.useState("");
  const [segmentFeedback, setSegmentFeedback] = React.useState<null | "ok" | "no">(null);
  const [auditoryChoice, setAuditoryChoice] = React.useState<string | null>(null);
  const [auditoryFeedback, setAuditoryFeedback] = React.useState<null | "ok" | "no">(null);
  const [codePair, setCodePair] = React.useState({ letter: "", sound: "" });
  const [codeFeedback, setCodeFeedback] = React.useState<null | "ok" | "no">(null);

  // ✅ Modal state
  const [showScoreModal, setShowScoreModal] = React.useState(false);
  const [lastScore, setLastScore] = React.useState<ScoreModalState>(null);

  React.useEffect(() => {
    setSegmentInput("");
    setSegmentFeedback(null);
    setAuditoryChoice(null);
    setAuditoryFeedback(null);
    setCodePair({ letter: "", sound: "" });
    setCodeFeedback(null);
  }, [selectedIndex]);

  const title = variant === "pretest" ? "Pre-test" : "Post-test";

  // ✅ Get student data passed from Laravel
  const { student } = usePage<{ student?: { id: number; name: string; grade: string } }>()
    .props;

  // --- Legacy toy handlers (fine to keep if you still use them visually) ---
  const handleSegmentCheck = () => {
    const normalized = segmentInput.toLowerCase().replace(/[\/]/g, "").trim();
    const noSpaces = normalized.replace(/\s|-/g, "");
    setSegmentFeedback(noSpaces === "map" ? "ok" : "no");
  };

  const handleAuditoryCheck = () => {
    const real = new Set(["cat", "map", "sun", "dog", "tap"]);
    if (!auditoryChoice) return;
    setAuditoryFeedback(real.has(auditoryChoice.toLowerCase()) ? "ok" : "no");
  };

  const handleCodeCheck = () => {
    const l = codePair.letter.trim().toLowerCase();
    const s = codePair.sound.trim().toLowerCase();
    setCodeFeedback(l === "a" && (s === "a" || s === "/a/") ? "ok" : "no");
  };

  // Small helper to open modal
  const openScoreModal = (testName: string, raw: number, max: number) => {
    setLastScore({ testName, raw, max });
    setShowScoreModal(true);
  };

  // --- Save functions with modal ---

  const saveBlendingOne = async (r: BlendingResult) => console.log("saveOne()", r);

  const saveBlendingAll = (results: BlendingResult[]) => {
    if (!student) return;

    // Blending Test: 1 point per exact match, 15 items total
    const raw = results.filter((r) => r.isExactMatch).length;
    const max = results.length; // 15

    router.post(
      "/tests/blending",
      {
        variant, // "pretest" | "posttest"
        student_id: student.id,
        results,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          console.log("Blending test saved successfully");
          openScoreModal("Blending Test", raw, max);
        },
        onError: (errors) => {
          console.error("Error saving blending test:", errors);
        },
      }
    );
  };

  const saveSegOne = async (r: PhonemeSegmentationResult) =>
    console.log("segmentation saveOne()", r);

  const saveSegAll = (results: PhonemeSegmentationResult[]) => {
    if (!student) return;

    // Segmenting: raw score is sum of soundedCount; max is sum of totalLetters
    const raw = results.reduce((sum, r) => sum + r.soundedCount, 0);
    const max = results.reduce((sum, r) => sum + r.totalLetters, 0);

    router.post(
      "/tests/segmentation",
      {
        variant, // "pretest" | "posttest"
        student_id: student.id,
        results,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          console.log("Segmentation test saved successfully");
          openScoreModal("Phoneme Segmentation Test", raw, max);
        },
        onError: (errors) => {
          console.error("Error saving segmentation test:", errors);
        },
      }
    );
  };

  const saveAuditoryOne = async (r: AuditoryProcessingResult) =>
    console.log("auditory saveOne()", r);

  const saveAuditoryAll = (results: AuditoryProcessingResult[]) => {
    if (!student) return;

    // Auditory Processing: 1 point per exact match
    const raw = results.filter((r) => r.isExactMatch).length;
    const max = results.length;

    router.post(
      "/tests/auditory",
      {
        variant, // "pretest" | "posttest"
        student_id: student.id,
        results,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          console.log("Auditory processing test saved successfully");
          openScoreModal("Auditory Processing Test", raw, max);
        },
        onError: (errors) => {
          console.error("Error saving auditory processing test:", errors);
        },
      }
    );
  };

  // Code knowledge is saved from the TEACHER view; student-facing CodeKnowledgeTest
  // here doesn’t POST anything yet, so no modal needed here.
  const saveCodeAll = async (r: CodeKnowledgeResult[]) =>
    console.log("code-knowledge saveAll()", r);

  return (
    <>
    <div className="min-h-screen flex from-background via-accent/20 to-tertiary/30">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-card border-r border-border transition-all duration-300 overflow-hidden shrink-0`}
      >
        <div className="p-6 overflow-y-auto h-full">
          <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
          <nav className="space-y-4">
            <div>
              <button
                onClick={() => setExpanded((e) => !e)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-all font-semibold text-foreground"
              >
                <span>Assessments</span>
                {expanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {expanded && (
                <div className="mt-2 space-y-2 pl-2">
                  {TEST_ITEMS.map((t, idx) => (
                    <button
                      key={t.name}
                      onClick={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm ${
                        selectedIndex === idx
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-muted text-foreground/80"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composite Reading Score button */}
            <div className="pt-4 border-t border-border mt-4">
              <Button
                className="w-full"
                variant="outline"
                disabled={!student}
                onClick={() => {
                  if (!student) return;
                  router.get("/tests/composite", {
                    variant,
                    student_id: student.id,
                  });
                }}
              >
                Composite Reading Score
              </Button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col p-4">
        <div className="mb-4">
          <Link href={ROUTES.DASHBOARD}>
            <Button variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 text-foreground">
            {title}
          </h1>

          {/* Student name */}
          {student && (
            <p className="text-center text-xl font-semibold text-pink-600 mb-4">
              Student: {student.name}
            </p>
          )}

          <p className="text-center mb-6 text-lg md:text-xl text-foreground/80">
            {TEST_ITEMS[selectedIndex].description}
          </p>

          {/* Dynamic test rendering */}
          {(() => {
            switch (selectedIndex) {
              case 0:
                return (
                  <BlendingTest
                    variant={variant}
                    onSubmitOne={saveBlendingOne}
                    onSubmitAll={saveBlendingAll}
                  />
                );
              case 1:
                return (
                  <PhonemeSegmentationTest
                    variant={variant}
                    onSubmitOne={saveSegOne}
                    onSubmitAll={saveSegAll}
                  />
                );
              case 2:
                return (
                  <AuditoryProcessingTest
                    variant={variant}
                    onSubmitOne={saveAuditoryOne}
                    onSubmitAll={saveAuditoryAll}
                  />
                );
              case 3:
                return (
                  <CodeKnowledgeTest
                    variant={variant}
                    onSubmitAll={saveCodeAll}
                    studentId={student?.id}
                    studentName={student?.name}
                  />
                );
              default:
                return null;
            }
          })()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link href={ROUTES.DASHBOARD}>
              <Button variant="secondary">
                <ChevronLeft className="w-4 h-4 mr-1" /> Home
              </Button>
            </Link>
            <Link href={ROUTES.GAMES}>
              <Button>
                Go to Games <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <p className="text-center mt-6 text-foreground/60 text-sm">
            {variant === "pretest"
              ? "Baseline assessment"
              : "Follow-up assessment"}
          </p>
        </div>
      </main>
    </div>

    {/* ✅ Score Modal */}
    {showScoreModal && lastScore && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-card text-foreground rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full mx-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Score Saved
          </h2>
          {student && (
            <p className="text-sm text-foreground/70 mb-1">
              Student: <span className="font-semibold">{student.name}</span>
            </p>
          )}
          <p className="text-sm text-foreground/70 mb-4">
            {lastScore.testName}
          </p>

          <p className="text-4xl md:text-5xl font-extrabold text-center mb-4">
            {lastScore.raw} <span className="text-foreground/60">/ {lastScore.max}</span>
          </p>

          <p className="text-xs text-foreground/60 mb-6 text-center">
            This test score has been stored. You can now review all test
            scores on the Composite Reading Score page.
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowScoreModal(false)}
            >
              Close
            </Button>
            {student && (
              <Button
                onClick={() => {
                  setShowScoreModal(false);
                  router.get("/tests/composite", {
                    variant,
                    student_id: student.id,
                  });
                }}
              >
                View Composite
              </Button>
            )}
          </div>
        </div>
      </div>
    )}
  </>
  );
}
