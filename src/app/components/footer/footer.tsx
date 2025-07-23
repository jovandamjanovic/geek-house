'use client';

import React from 'react';
import {useTranslations} from '../../../hooks/useTranslations';

const Footer: React.FC = () => {
  const t = useTranslations('Footer');
  
  return (
    <footer>
      <p>{t('copyright')}</p>
    </footer>
  );
};

export default Footer;