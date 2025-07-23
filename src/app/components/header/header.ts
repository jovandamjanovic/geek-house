'use client'
import React from 'react';
import {useTranslations} from '../../../hooks/useTranslations';
import LanguageSwitcher from '../language-switcher/LanguageSwitcher';
import styles from './header.module.css';

const Header: React.FC = () => {
  const t = useTranslations('Header');
  
  return React.createElement(
    'header',
    { className: styles.header },
    React.createElement('img', {
        src: '/gh_large.png',
        alt: 'Logo',
        className: styles.logo,
    }),
    React.createElement(
      'nav',
      { className: styles.nav },
      React.createElement('a', { href: '/' }, t('home')),
      React.createElement('a', { href: '/about' }, t('about')),
      React.createElement('a', { href: '/contact' }, t('contact')),
      React.createElement(LanguageSwitcher)
    )
  );
};

export default Header;