import React from 'react';
import Header from '../header';
import Footer from '../footer';

type Props = {
  children: React.ReactNode;
};

const HeaderFooterLayout: React.FC<Props> = ({ children }) => {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Header),
    React.createElement('main', null, children),
    React.createElement(Footer)
  );
};

export default HeaderFooterLayout;