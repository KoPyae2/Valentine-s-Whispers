import React from 'react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Modal({ open, children }: ModalProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      {children}
    </div>
  );
} 