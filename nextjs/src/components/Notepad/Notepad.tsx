"use client";

import React from "react";
import styles from "./Notepad.module.css";

type NotepadProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Notepad({ title, onClose, children }: NotepadProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.notepadWindow}>
        <div className={styles.notepadTitleBar}>
          <span className={styles.notepadTitle}>{title}</span>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className={styles.notepadMenuBar}>
          <span className={styles.menuItem}>File</span>
          <span className={styles.menuItem}>Edit</span>
          <span className={styles.menuItem}>Search</span>
          <span className={styles.menuItem}>Help</span>
        </div>
        <div className={styles.notepadContent}>
          <div className={styles.notepadText}>{children}</div>
        </div>
      </div>
    </div>
  );
}
