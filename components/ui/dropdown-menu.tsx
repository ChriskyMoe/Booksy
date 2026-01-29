"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom"; // Import ReactDOM
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
}

export function DropdownMenu({
  trigger,
  children,
  align = "right",
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null); // Ref for the trigger element
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let newLeft = rect.left;

      if (align === "right") {
        newLeft = rect.right - 192; // 192px is w-48
      }

      setPosition({
        top: rect.bottom + 8, // 8px for mt-2
        left: newLeft,
      });
    }
  }, [isOpen, align]);

  return (
    <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
      {trigger}
      {isOpen &&
        position &&
        ReactDOM.createPortal(
          <div
            className={cn(
              "absolute z-50 w-48 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
            )}
            style={{ top: position.top, left: position.left }}
            ref={dropdownRef} // Ref moved to the portal content
          >
            {children}
          </div>,
          document.body // Render into document.body
        )}
    </div>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isDestructive?: boolean;
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
  isDestructive = false,
}: DropdownMenuItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isDestructive && "text-destructive hover:bg-destructive/10",
        className
      )}
    >
      {children}
    </div>
  );
}
