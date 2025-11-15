import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

interface Student {
  id: number;
  name: string;
  grade: string;
}

interface SelectStudentModalProps {
  open: boolean;
  onClose: () => void;
  students: Student[];
  testType: "pre-test" | "post-test" | null;
}

export default function SelectStudentModal({
  open,
  onClose,
  students,
  testType,
}: SelectStudentModalProps) {
  const [selectedStudent, setSelectedStudent] = React.useState<number | null>(null);
  const [selectedGrade, setSelectedGrade] = React.useState<string>("All");

  const grades = [
    "All",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
  ];

  // 🧠 Reset selections when modal closes
  React.useEffect(() => {
    if (!open) {
      setSelectedStudent(null);
      setSelectedGrade("All");
    }
  }, [open]);

  // Filter students based on selected grade
  const filteredStudents =
    selectedGrade === "All"
      ? students
      : students.filter((s) => s.grade === selectedGrade);

  const handleStart = () => {
    if (!selectedStudent || !testType) return;
    router.visit(`/${testType}?student=${selectedStudent}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto rounded-2xl bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 p-8 shadow-2xl border-4 border-pink-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-pink-600 mb-4 text-center">
            Select Student
          </DialogTitle>
        </DialogHeader>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Student List */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-blue-700 mb-2 text-center md:text-left">
              Students
            </label>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <p className="text-gray-500 text-lg text-center">
                  No students found.
                </p>
              ) : (
                filteredStudents.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudent(s.id)}
                    className={`w-full py-3 rounded-xl border-2 text-lg font-semibold transition-all ${
                      selectedStudent === s.id
                        ? "bg-pink-500 text-white border-pink-600"
                        : "bg-white hover:bg-pink-100 border-yellow-300"
                    }`}
                  >
                    {s.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: Grade Filter */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-blue-700 mb-2 text-center md:text-left">
              Filter by Grade Level
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full border-2 border-yellow-300 rounded-xl text-lg px-3 py-2 focus:border-pink-400 bg-white"
            >
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={onClose}
            variant="secondary"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStart}
            disabled={!selectedStudent}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-2 rounded-xl shadow-md disabled:opacity-50"
          >
            Start {testType === "pre-test" ? "Pre-test" : "Post-test"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
