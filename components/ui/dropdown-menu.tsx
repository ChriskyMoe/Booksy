'use client'

import React, { useState, useRef, useEffect, useContext } from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuContextType {
    open: boolean
    setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | undefined>(undefined)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        if (open) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [open])

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen }}>
            <div ref={menuRef} className="relative inline-block text-left">
                {children}
            </div>
        </DropdownMenuContext.Provider>
    )
}

export function DropdownMenuTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
    const context = useContext(DropdownMenuContext)
    if (!context) throw new Error('DropdownMenuTrigger must be used within DropdownMenu')

    return (
        <div onClick={() => context.setOpen(!context.open)} className={cn("cursor-pointer", className)}>
            {children}
        </div>
    )
}

export function DropdownMenuContent({ children, className, align = 'end', side = 'bottom' }: { children: React.ReactNode; className?: string; align?: 'start' | 'end'; side?: 'bottom' | 'top' | 'right' | 'left' }) {
    const context = useContext(DropdownMenuContext)
    if (!context) throw new Error('DropdownMenuContent must be used within DropdownMenu')

    if (!context.open) return null

    const sideClasses = {
        bottom: "mt-2",
        top: "bottom-full mb-2",
        right: "left-full top-0 ml-2",
        left: "right-full top-0 mr-2"
    }

    const alignClasses = {
        start: side === 'bottom' || side === 'top' ? "left-0 origin-top-left" : "origin-top-left",
        end: side === 'bottom' || side === 'top' ? "right-0 origin-top-right" : "origin-bottom-left"
    }

    // Adjust alignment for side placement (right/left)
    if (side === 'right' || side === 'left') {
        // For side placement, align determines vertical alignment (start=top, end=bottom)
        // Simple override for now as "align" in simple dropdown usually means horizontal for top/bottom
        // We will stick to simple absolute positioning
    }

    return (
        <div
            className={cn(
                "absolute z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
                sideClasses[side],
                (side === 'bottom' || side === 'top') && (align === 'end' ? "right-0" : "left-0"),
                // Basic origin settings
                side === 'bottom' ? "origin-top" :
                    side === 'top' ? "origin-bottom" :
                        side === 'right' ? "origin-left" : "origin-right",
                className
            )}
        >
            <div className="p-1">{children}</div>
        </div>
    )
}

export function DropdownMenuItem({ children, className, onClick, inset }: { children: React.ReactNode; className?: string; onClick?: () => void; inset?: boolean }) {
    const context = useContext(DropdownMenuContext)
    if (!context) throw new Error('DropdownMenuItem must be used within DropdownMenu')

    return (
        <div
            onClick={(e) => {
                e.stopPropagation()
                onClick?.()
                context.setOpen(false)
            }}
            className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                inset && "pl-8",
                className
            )}
        >
            {children}
        </div>
    )
}

export function DropdownMenuLabel({ children, className, inset }: { children: React.ReactNode; className?: string; inset?: boolean }) {
    return (
        <div className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}>
            {children}
        </div>
    )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
    return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
}
