"use client";

import { useState } from "react";
import TransactionModal from "./TransactionModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddTransactionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 px-6 py-2 rounded-lg border-0"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Transaction
      </Button>
      <TransactionModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
