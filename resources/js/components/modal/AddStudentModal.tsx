import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import Confetti from "react-confetti";
import SuccessModal from "./SuccessModal";

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddStudentModal({ open, onClose }: AddStudentModalProps) {
  const [name, setName] = React.useState("");
  const [grade, setGrade] = React.useState("Grade 1");
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const grades = [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
  ];

  const handleSubmit = () => {
    if (name.trim() === "") return;

    router.post(
      "/students",
      { name, grade },
      {
        onSuccess: () => {
          // Reset input fields
          setName("");
          setGrade("Grade 1");
          onClose();

          // Trigger success effects
          setShowSuccess(true);
          setShowConfetti(true);

          // Stop confetti after 4 seconds
          setTimeout(() => setShowConfetti(false), 4000);
        },
      }
    );
  };

  return (
    <>
      {/*  Add Student Modal */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg mx-auto rounded-2xl bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 p-8 shadow-2xl border-4 border-pink-200">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center font-extrabold text-pink-600 mb-4">
              Add New Student
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="student-name" className="text-lg text-blue-700 font-semibold">
                Name
              </Label>
              <Input
                id="student-name"
                placeholder="Enter student's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 border-2 border-yellow-300 rounded-xl text-lg focus:border-pink-400"
              />
            </div>

            <div>
              <Label htmlFor="student-grade" className="text-lg text-blue-700 font-semibold">
                Grade
              </Label>
              <select
                id="student-grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="mt-1 w-full border-2 border-yellow-300 rounded-xl text-lg px-3 py-2 focus:border-pink-400 bg-white"
              >
                {grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-center gap-4">
            <Button
              onClick={onClose}
              variant="secondary"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-2 rounded-xl shadow-md"
            >
              Save Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        />

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
    </>
  );
}
