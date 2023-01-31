import React from 'react';
import Footer from './Footer';
import TopMenu from './TopMenu';

const Layout = ({ children }) => {
  return (
    <>
      <TopMenu />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
