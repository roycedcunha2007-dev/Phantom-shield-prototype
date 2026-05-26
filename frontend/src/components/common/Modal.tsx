"use client";

import type { ReactNode } from "react";

interface ModalProps {
  overlayClassName: string;
  dialogClassName: string;
  onClose: () => void;
  children: ReactNode;
}

// Shared modal shell; each feature owns only its specific body content.
export function Modal({ overlayClassName, dialogClassName, onClose, children }: ModalProps) {
  return (
    <div className={overlayClassName} onClick={onClose}>
      <div className={dialogClassName} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
