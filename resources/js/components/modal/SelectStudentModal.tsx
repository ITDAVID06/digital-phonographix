'use client';

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { ChevronDown, X, User, BookOpen } from 'lucide-react';

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

  const grades = ["All", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];

  React.useEffect(() => {
    if (!open) {
      setSelectedStudent(null);
      setSelectedGrade("All");
    }
  }, [open]);

  const filteredStudents = selectedGrade === "All" 
    ? students 
    : students?.filter((s) => s.grade === selectedGrade) || [];

  const handleStart = () => {
    if (!selectedStudent || !testType) return;
    router.visit(`/${testType}?student=${selectedStudent}`);
    onClose();
  };

  const selectedStudentData = students?.find((s) => s.id === selectedStudent);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-full sm:min-w-96 md:min-w-2xl lg:min-w-3xl max-w-4xl rounded-2xl border-0 shadow-2xl bg-white p-0 overflow-hidden gap-0">
        
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 sm:px-8 py-8 sm:py-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-white/70 hover:text-white" />
          </button>
          
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-indigo-300">
                Assessment
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Select Student for {testType === "pre-test" ? "Pre-Test" : "Post-Test"}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Choose the student who will complete this assessment today
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
          
          {/* Students List - Left Panel */}
          <div className="md:col-span-2 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                Available Students
              </label>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {filteredStudents.length}
              </span>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <User className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">No students in this grade</p>
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border-2 font-medium transition-all duration-200 flex items-center gap-3 group ${
                      selectedStudent === student.id
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-md"
                        : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      selectedStudent === student.id 
                        ? "bg-indigo-500 text-white" 
                        : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100"
                    }`}>
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{student.name}</p>
                      <p className="text-xs opacity-70">{student.grade}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Filter & Summary */}
          <div className="p-6 sm:p-8 flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3">
              Filter by Grade
            </label>
            
            <div className="relative mb-6">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full appearance-none border-2 border-slate-200 rounded-lg px-3 sm:px-4 py-3 bg-white text-slate-700 font-medium text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer hover:border-slate-300"
              >
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            {/* Summary Card */}
            {selectedStudentData && (
              <div className="mt-auto bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200 flex flex-col">
                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-2">
                  Selected
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                    {selectedStudentData.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{selectedStudentData.name}</p>
                    <p className="text-xs text-slate-600">{selectedStudentData.grade}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex justify-end gap-3 px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200">
          <Button
            onClick={onClose}
            className="px-5 sm:px-6 py-2.5 rounded-lg bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 font-semibold text-sm transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStart}
            disabled={!selectedStudent}
            className={`px-6 sm:px-8 py-2.5 rounded-lg font-bold text-sm transition-all text-white ${
              selectedStudent
                ? "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            Start {testType === "pre-test" ? "Pre-Test" : "Post-Test"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
