'use client';

import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import FlagLanguageSwitcher from '@/app/components/flag-language-switcher/FlagLanguageSwitcher';
import styles from './footer.module.css';

const Footer: React.FC = () => {
  const t = useTranslations('Footer');
  
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>{t('copyright')}</p>
      <FlagLanguageSwitcher />
    </footer>
  );
};

export default Footer;