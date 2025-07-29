'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from '@/hooks/useTranslations';
import LanguageSwitcher from '../language-switcher/LanguageSwitcher';
import styles from './header.module.css';
import { useThrottle } from '@/hooks/useThrottle';

const Header: React.FC = () => {
  const t = useTranslations('Header');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const prevScrollY = useRef(0); // ✅ store previous scroll position persistently

  const throttledScroll = useThrottle(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < prevScrollY.current) {
      setIsHeaderVisible(true); // scrolling up
    } else if (currentScrollY > 100) {
      setIsHeaderVisible(false); // scrolling down
    }

    prevScrollY.current = currentScrollY;
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);

  return (
    <header className={`${styles.header} ${!isHeaderVisible ? styles.hidden : ''}`}>
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