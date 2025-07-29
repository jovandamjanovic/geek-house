import React from 'react';
import ContactForm from '../components/contact-form/ContactForm';
import style from "./page.module.css"

const ContactPage: React.FC = () => {
  return (
    <div className={ style.div }>
      <ContactForm />
    </div>
  );
};

export default ContactPage;
