'use client'

import React from 'react';
import {useTranslations} from '../../../hooks/useTranslations';
import LanguageSwitcher from '../language-switcher/LanguageSwitcher';
import styles from './header.module.css';

const Header: React.FC = () => {
  const t = useTranslations('Header');
  
  return (
    <header className={styles.header}>
      <img
        src="/gh_large.png"
        alt="Logo"
        className={styles.logo}
      />
      <nav className={styles.nav}>
        <a href="/">{t('home')}</a>
        <a href="/about">{t('about')}</a>
        <a href="/contact">{t('contact')}</a>
        <LanguageSwitcher />
      </nav>
    </header>
  );
};

export default Header;