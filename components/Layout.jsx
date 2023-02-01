import React from 'react';
import Footer from './Footer';
import TopMenu from './TopMenu';
import { styled } from '@mui/material/styles';

const LayoutDiv = styled('div')(({theme})=>({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));


const Layout = ({ children }) => {
  return (
    <LayoutDiv>
      <TopMenu />
      {children}
      <Footer />
    </LayoutDiv>
  );
};

export default Layout;
