"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);
  const [showTasksDialog, setShowTasksDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    setTime(new Date().toLocaleTimeString());
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const tasks = [
    "Buy server",
    "Setup domain",
    "Setup SSL",
    "Setup nginx",
    "Setup Next.js app with Docker",
    "Setup auto deploy with GitHub actions",
  ];

  return (
    <div className={styles.desktop}>
      {/* Windows XP Desktop Background */}
      <div className={styles.taskbar}>
        <div
          className={styles.startButton}
          onClick={() => setShowWelcomeDialog(true)}
        >
          <span>start</span>
        </div>
        <div className={styles.taskbarTime}>{mounted ? time : ""}</div>
      </div>

      {/* Desktop Icons */}
      <div className={styles.desktopIcons}>
        <div
          className={styles.desktopIcon}
          onClick={() => setShowTasksDialog(true)}
        >
          <div className={styles.iconImage}>📄</div>
          <span>Tasks</span>
        </div>
      </div>

      {/* Welcome Dialog */}
      {showWelcomeDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <div className={styles.dialogTitleBar}>
              <span className={styles.dialogTitle}>Welcome</span>
              <button
                className={styles.closeButton}
                onClick={() => setShowWelcomeDialog(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.dialogContent}>
              <div className={styles.dialogIcon}>ℹ️</div>
              <div className={styles.dialogText}>
                <h3>DevOps Playground</h3>
                <p>
                  This is a DevOps playground used for educational purposes.
                </p>
                <p>
                  Explore the completed tasks and learn about modern DevOps
                  practices.
                </p>
              </div>
            </div>
            <div className={styles.dialogButtons}>
              <button
                className={styles.okButton}
                onClick={() => setShowWelcomeDialog(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Dialog */}
      {showTasksDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <div className={styles.dialogTitleBar}>
              <span className={styles.dialogTitle}>Completed Tasks</span>
              <button
                className={styles.closeButton}
                onClick={() => setShowTasksDialog(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.dialogContent}>
              <div className={styles.dialogIcon}>📋</div>
              <div className={styles.dialogText}>
                <h3>DevOps Tasks Completed</h3>
                <ul className={styles.tasksList}>
                  {tasks.map((task, index) => (
                    <li key={index} className={styles.taskItem}>
                      ✅ {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.dialogButtons}>
              <button
                className={styles.okButton}
                onClick={() => setShowTasksDialog(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
