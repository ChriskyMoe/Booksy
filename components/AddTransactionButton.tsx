'use client'

import { useState } from 'react'
import TransactionModal from './TransactionModal'

export default function AddTransactionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        + Add Transaction
      </button>
      <TransactionModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
