'use client'

import React, {useEffect, useRef} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useTranslations} from '../../../hooks/useTranslations';
import LanguageSwitcher from '../language-switcher/LanguageSwitcher';
import styles from './header.module.css';

const Header: React.FC = () => {
  const t = useTranslations('Header');

  // header animation
  const navShowHide = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const header = navShowHide.current;

      if (!header) return;

      if (currentScrollY < prevScrollY) {
        // Scroll up - show
        header.style.transform = 'translateY(0)';
      } else {
        // Scroll down - hide
        header.style.transform = 'translateY(-120%)';
      }

      prevScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={styles.header}  
            ref={navShowHide}>
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