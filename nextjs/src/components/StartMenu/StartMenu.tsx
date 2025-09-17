"use client";

import Image from "next/image";
import styles from "./StartMenu.module.css";

type StartMenuProps = {
  onOpenTasks: () => void;
  onOpenHelp: () => void;
  onShutdown: () => void;
};

export default function StartMenu({
  onOpenTasks,
  onOpenHelp,
  onShutdown,
}: StartMenuProps) {
  return (
    <div className={styles.startMenu}>
      <div className={styles.startMenuHeader}>
        <span>Windows 95</span>
      </div>
      <div className={styles.startMenuItem} onClick={onOpenTasks}>
        <Image src="/notepad.png" alt="Tasks" width={16} height={16} />
        <span>Tasks.txt</span>
      </div>
      <div className={styles.startMenuItem} onClick={onOpenHelp}>
        <Image src="/help.png" alt="Help" width={16} height={16} />
        <span>Help</span>
      </div>
      <div className={styles.startMenuSeparator}></div>
      <div className={styles.startMenuItem} onClick={onShutdown}>
        <Image src="/shutdown.png" alt="Shutdown" width={16} height={16} />
        <span>Shut Down</span>
      </div>
    </div>
  );
}
