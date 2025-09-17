"use client";

import React from "react";
import styles from "./Shutdown.module.css";

type ShutdownProps = {
  onPowerOn: () => void;
};

export default function Shutdown({ onPowerOn }: ShutdownProps) {
  return (
    <div className={styles.shutdownScreen} onClick={onPowerOn}>
      <div className={styles.shutdownMessage}>
        <div className={styles.shutdownIcon}>💻</div>
        <div className={styles.shutdownText}>Your computer is now safe to turn off.</div>
        <div className={styles.shutdownSubtext}>Click anywhere to turn on</div>
      </div>
    </div>
  );
}


