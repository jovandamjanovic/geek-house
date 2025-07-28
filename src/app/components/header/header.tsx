'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useTranslations} from '@/hooks/useTranslations';
import LanguageSwitcher from '../language-switcher/LanguageSwitcher';
import styles from './header.module.css';

const Header: React.FC = () => {
  const t = useTranslations('Header');
  
  return (
    <header className={styles.header}>
      <Image
        src="/gh_large.png"
        alt="Logo"
        width={180}
        height={180}
        className={styles.logo}
      />
      <nav className={styles.nav}>
        <Link href="/">{t('home')}</Link>
        <Link href="/about">{t('about')}</Link>
        <Link href="/contact">{t('contact')}</Link>
        <LanguageSwitcher />
      </nav>
    </header>
  );
};

export default Header;