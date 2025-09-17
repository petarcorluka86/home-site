"use client";

import React, { forwardRef } from "react";
import styles from "./Toolbar.module.css";

type ToolbarProps = {
  time: string;
  onToggleStartMenu: () => void;
};

const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ time, onToggleStartMenu }, startButtonRef) => {
    return (
      <div className={styles.taskbar}>
        <div
          className={styles.startButton}
          onClick={onToggleStartMenu}
          ref={startButtonRef}
        >
          <span>START</span>
        </div>
        <div className={styles.taskbarTime}>{time}</div>
      </div>
    );
  }
);

Toolbar.displayName = "Toolbar";

export default Toolbar;


