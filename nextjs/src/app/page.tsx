"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showTasksDialog, setShowTasksDialog] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);
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

  // Close Start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showStartMenu) {
        const target = event.target as Element;
        if (
          !target.closest(`.${styles.startMenu}`) &&
          !target.closest(`.${styles.startButton}`)
        ) {
          setShowStartMenu(false);
        }
      }
    };

    if (showStartMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStartMenu]);

  const tasks = [
    "Buy server",
    "Setup domain",
    "Setup SSL",
    "Setup nginx",
    "Setup Next.js app with Docker",
    "Setup auto deploy with GitHub actions",
  ];

  // If shutdown, show shutdown screen
  if (isShutdown) {
    return (
      <div
        className={styles.shutdownScreen}
        onClick={() => setIsShutdown(false)}
      >
        <div className={styles.shutdownMessage}>
          <div className={styles.shutdownIcon}>💻</div>
          <div className={styles.shutdownText}>
            Your computer is now safe to turn off.
          </div>
          <div className={styles.shutdownSubtext}>
            Click anywhere to turn on
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.desktop}>
      {/* Windows XP Desktop Background */}
      <div className={styles.taskbar}>
        <div
          className={styles.startButton}
          onClick={() => setShowStartMenu(!showStartMenu)}
        >
          <span>START</span>
        </div>
        <div className={styles.taskbarTime}>{mounted ? time : ""}</div>
      </div>

      {/* Windows 95 Start Menu */}
      {showStartMenu && (
        <div className={styles.startMenu}>
          <div className={styles.startMenuHeader}>
            <span>Windows 95</span>
          </div>
          <div
            className={styles.startMenuItem}
            onClick={() => {
              setShowTasksDialog(true);
              setShowStartMenu(false);
            }}
          >
            <Image src="/notepad.png" alt="Tasks" width={16} height={16} />
            <span>Tasks.txt</span>
          </div>
          <div
            className={styles.startMenuItem}
            onClick={() => {
              setShowWelcomeDialog(true);
              setShowStartMenu(false);
            }}
          >
            <Image src="/help.png" alt="Help" width={16} height={16} />
            <span>Help</span>
          </div>
          <div className={styles.startMenuSeparator}></div>
          <div
            className={styles.startMenuItem}
            onClick={() => {
              setShowStartMenu(false);
              setIsShutdown(true);
            }}
          >
            <Image src="/shutdown.png" alt="Shutdown" width={16} height={16} />
            <span>Shut Down</span>
          </div>
        </div>
      )}

      {/* Desktop Icons */}
      <div className={styles.desktopIcons}>
        <div
          className={styles.desktopIcon}
          onClick={() => setShowTasksDialog(true)}
        >
          <Image src="/notepad.png" alt="Tasks" width={32} height={32} />
          <span>Tasks.txt</span>
        </div>
        <div
          className={styles.desktopIcon}
          onClick={() => setShowWelcomeDialog(true)}
        >
          <Image src="/help.png" alt="Help" width={32} height={32} />
          <span>Help</span>
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
                <h3>Hi there!</h3>
                <p>
                  This is a DevOps playground used for educational purposes.
                </p>
                <p>There is no real use of this site.</p>
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

      {/* Tasks Dialog - Windows 95 Notepad Style */}
      {showTasksDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.notepadWindow}>
            <div className={styles.notepadTitleBar}>
              <span className={styles.notepadTitle}>Tasks.txt - Notepad</span>
              <button
                className={styles.closeButton}
                onClick={() => setShowTasksDialog(false)}
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
              <div className={styles.notepadText}>
                DevOps Tasks Completed:
                <br />
                <br />
                {tasks.map((task, index) => (
                  <div key={index} className={styles.notepadTask}>
                    • {task}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
