"use client";

import React from "react";
import styles from "./Dialog.module.css";

type DialogProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  closeOnOverlayClick?: boolean;
};

export default function Dialog({
  title,
  onClose,
  children,
  icon,
  actions,
  closeOnOverlayClick = true,
}: DialogProps) {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) return;
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.dialogOverlay} onClick={handleOverlayClick}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog95-title"
      >
        <div className={styles.dialogTitleBar}>
          <span id="dialog95-title" className={styles.dialogTitle}>
            {title}
          </span>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className={styles.dialogContent}>
          {icon ? <div className={styles.dialogIcon}>{icon}</div> : null}
          <div className={styles.dialogText}>{children}</div>
        </div>
        <div className={styles.dialogButtons}>
          {actions ?? (
            <button className={styles.okButton} onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
