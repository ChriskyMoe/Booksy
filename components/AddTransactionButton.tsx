'use client'

import { useState } from 'react'
import TransactionModal from './TransactionModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function AddTransactionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Transaction
      </Button>
      <TransactionModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
