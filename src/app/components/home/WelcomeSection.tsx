"use client";

import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import styles from "./WelcomeSection.module.css";

interface WelcomeSectionProps {
  className?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ className }) => {
  const t = useTranslations("HomePage");
  const tHeader = useTranslations("Header");

  return (
    <section className={`${styles.welcome} ${className || ""}`}>
      <div className={styles.welcomeContent}>
        <h1 className={styles.welcomeTitle}>
          {t("welcomeTitle")}
          {tHeader("clubName")}
        </h1>
        <p className={styles.welcomeSubtitle}>{t("welcomeSubtitle")}</p>
        <button className={styles.joinButton}>{t("joinNow")}</button>
      </div>
    </section>
  );
};

export default WelcomeSection;
