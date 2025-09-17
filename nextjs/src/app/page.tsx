"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Dialog from "@/components/Dialog/Dialog";
import StartMenu from "@/components/StartMenu/StartMenu";
import DesktopIcon from "@/components/DesktopIcon/DesktopIcon";
import Notepad from "@/components/Notepad/Notepad";

export default function Home() {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showTasksDialog, setShowTasksDialog] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<string>("");
  const startMenuRef = useRef<HTMLDivElement | null>(null);
  const startButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setTime(new Date().toLocaleTimeString());
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Close Start menu when clicking outside (using refs)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showStartMenu) return;
      const target = event.target as Node;
      const menuEl = startMenuRef.current;
      const buttonEl = startButtonRef.current;
      const clickedOutsideMenu = menuEl ? !menuEl.contains(target) : true;
      const clickedOutsideButton = buttonEl ? !buttonEl.contains(target) : true;
      if (clickedOutsideMenu && clickedOutsideButton) {
        setShowStartMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          ref={startButtonRef}
        >
          <span>START</span>
        </div>
        <div className={styles.taskbarTime}>{mounted ? time : ""}</div>
      </div>

      {/* Windows 95 Start Menu */}
      {showStartMenu && (
        <div ref={startMenuRef}>
          <StartMenu
            onOpenTasks={() => {
              setShowTasksDialog(true);
              setShowStartMenu(false);
            }}
            onOpenHelp={() => {
              setShowWelcomeDialog(true);
              setShowStartMenu(false);
            }}
            onShutdown={() => {
              setShowStartMenu(false);
              setIsShutdown(true);
            }}
          />
        </div>
      )}

      {/* Desktop Icons */}
      <div className={styles.desktopIcons}>
        <DesktopIcon label="Tasks.txt" onOpen={() => setShowTasksDialog(true)}>
          <Image src="/notepad.png" alt="Tasks" width={32} height={32} />
        </DesktopIcon>
        <DesktopIcon label="Help" onOpen={() => setShowWelcomeDialog(true)}>
          <Image src="/help.png" alt="Help" width={32} height={32} />
        </DesktopIcon>
      </div>

      {/* Welcome Dialog */}
      {showWelcomeDialog && (
        <Dialog
          title="Welcome"
          onClose={() => setShowWelcomeDialog(false)}
          icon={"ℹ️"}
        >
          <h3>Hi there!</h3>
          <p>This is a DevOps playground used for educational purposes.</p>
          <p>There is no real use of this site.</p>
        </Dialog>
      )}

      {/* Tasks Dialog - Windows 95 Notepad Style */}
      {showTasksDialog && (
        <Notepad
          title="Tasks.txt - Notepad"
          onClose={() => setShowTasksDialog(false)}
        >
          DevOps Tasks Completed:
          <br />
          <br />
          {tasks.map((task, index) => (
            <div key={index}>• {task}</div>
          ))}
        </Notepad>
      )}
    </div>
  );
}
