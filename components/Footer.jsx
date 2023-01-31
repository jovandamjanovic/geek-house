import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Link from 'next/link'

const FooterStyled = styled('footer')(({theme})=>({
  display: 'flex',
  backgroundColor: theme.palette.secondary.main,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
  fontSize: 'smaller',
  textAlign: 'center',
  position: 'fixed',
  bottom: 0,
  width: '100%',
  padding: '2em'
}));

const Footer = () => {
  return (
    <FooterStyled>
      <Typography variant="span">Copyright © {new Date().getFullYear()} Geek House</Typography>
      <Typography variant="span">Contact: <Link href="mailto:admin@geekhouse.com">admin@geekhouse.com</Link></Typography>
    </FooterStyled>
  );
};

export default Footer;
