'use client';

import Image from "next/image";
import {useTranslations} from '../hooks/useTranslations';
import styles from "./page.module.css";

/**
 * Renders the home page with a logo, welcome headings, and instructions for editing the source file.
 *
 * Displays the site name dynamically and provides guidance for getting started with development.
 */
export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <div className={styles.page}>
      <main className={styles.main}>
          <Image
          className={styles.logo}
          src="/gh_large.png"
          alt="Geek House logo"
          width={180}
          height={180}
          priority
        />
        <h1>{t('title')}</h1>
        <ol>
          <li>
            {t('getStarted')} <code>{t('editFile')}</code>.
          </li>
          <li>{t('saveChanges')}</li>
        </ol>
      </main>
    </div>
  );
}
