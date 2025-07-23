'use client';

import React from 'react';
import {useTranslations} from '../../../hooks/useTranslations';

const Footer: React.FC = () => {
  const t = useTranslations('Footer');
  
  return React.createElement('footer', null,
    React.createElement('p', null, t('copyright'))
  );
};

export default Footer;