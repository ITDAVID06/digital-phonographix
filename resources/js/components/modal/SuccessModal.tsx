import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SuccessModal({ open, onClose }: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          flex flex-col justify-center items-center
          max-w-md mx-auto text-center
          rounded-2xl border-4 border-green-200
          bg-gradient-to-br from-green-50 via-yellow-50 to-pink-50
          p-8 shadow-xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-4xl font-extrabold text-green-600 mb-4">
            🎉 Student Added Successfully!
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="mt-4 flex justify-center">
          <Button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl shadow-md text-lg"
          >
            Awesome!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
