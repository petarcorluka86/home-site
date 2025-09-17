"use client";

import React from "react";
import styles from "./DesktopIcon.module.css";

type DesktopIconProps = {
  label: string;
  onOpen: () => void;
  children: React.ReactNode; // icon image node
};

export default function DesktopIcon({
  label,
  onOpen,
  children,
}: DesktopIconProps) {
  return (
    <div className={styles.desktopIcon} onClick={onOpen}>
      <div className={styles.iconImage}>{children}</div>
      <span className={styles.iconLabel}>{label}</span>
    </div>
  );
}
