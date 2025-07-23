import React from 'react';
import styles from './header.module.css';

const Header: React.FC = () => {
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
      React.createElement('a', { href: '/' }, 'Početna'),
      React.createElement('a', { href: '/about' }, 'O Nama'),
      React.createElement('a', { href: '/contact' }, 'Kontakt')
    )
  );
};

export default Header;