"use client";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useMemo } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import styles from "./ContactForm.module.css";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const t = useTranslations("ContactForm");
  const commonT = useTranslations();

  const schema = useMemo(
    () =>
      Joi.object({
        name: Joi.string()
          .min(2)
          .required()
          .messages({
            "string.empty": t("errors.nameRequired"),
            "string.min": t("errors.nameMin"),
            "any.required": t("errors.nameRequired"),
          }),
        email: Joi.string()
          .email({ tlds: { allow: false } })
          .required()
          .messages({
            "string.empty": t("errors.emailRequired"),
            "string.email": t("errors.emailInvalid"),
            "any.required": t("errors.emailRequired"),
          }),
        message: Joi.string()
          .min(10)
          .required()
          .messages({
            "string.empty": t("errors.messageRequired"),
            "string.min": t("errors.messageMin"),
            "any.required": t("errors.messageRequired"),
          }),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
  } = useForm<ContactFormData>({
    resolver: joiResolver(schema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log("Contact form data:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert(t("success"));
    reset();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("title")}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            {t("name")}
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className={`${styles.input} ${errors.name && dirtyFields.name ? styles.inputError : ""}`}
          />
          <span
            className={
              errors.name && dirtyFields.name
                ? styles.error
                : styles.errorPlaceholder
            }
          >
            {errors.name && dirtyFields.name ? errors.name.message : ""}
          </span>
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            {t("email")}
          </label>
          <input
            id="email"
            type="text"
            {...register("email")}
            className={`${styles.input} ${errors.email && dirtyFields.email ? styles.inputError : ""}`}
          />
          <span
            className={
              errors.email && dirtyFields.email
                ? styles.error
                : styles.errorPlaceholder
            }
          >
            {errors.email && dirtyFields.email ? errors.email.message : ""}
          </span>
        </div>

        <div className={styles.field}>
          <label htmlFor="message" className={styles.label}>
            {t("message")}
          </label>
          <textarea
            id="message"
            rows={5}
            {...register("message")}
            className={`${styles.textarea} ${errors.message && dirtyFields.message ? styles.inputError : ""}`}
          />
          <span
            className={
              errors.message && dirtyFields.message
                ? styles.error
                : styles.errorPlaceholder
            }
          >
            {errors.message && dirtyFields.message
              ? errors.message.message
              : ""}
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? commonT("Common.loading") : t("submit")}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
