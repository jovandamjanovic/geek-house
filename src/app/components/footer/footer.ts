import React from 'react';

const Footer: React.FC = () => {
  return React.createElement('footer', null,
    React.createElement('p', null, `© ${new Date().getFullYear()} GIK HAUS`)
  );
};

export default Footer;