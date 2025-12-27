// src/app/[locale]/contact/components/ContactForm.js
"use client";

import { Box, Paper, TextField, Button, alpha } from "@mui/material";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import axios from "axios";

export default function ContactForm({ t, isMobile, theme }) {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("form.emailInvalid"))
      .required(t("form.emailRequired")),
    firstName: Yup.string()
      .min(2, t("form.firstNameMin"))
      .required(t("form.firstNameRequired")),
    lastName: Yup.string()
      .min(2, t("form.lastNameMin"))
      .notRequired()
      .nullable()
      .test(
        "lastName",
        t("form.lastNameMin"),
        (value) => !value || (value && value.length >= 2)
      ),
    linkedin: Yup.string()
      .url(t("form.linkedinUrlInvalid"))
      .matches(/linkedin\.com/, t("form.linkedinUrlInvalid"))
      .notRequired()
      .nullable()
      .test(
        "linkedin",
        t("form.linkedinUrlInvalid"),
        (value) => !value || (value && /linkedin\.com/.test(value))
      ),
    company: Yup.string().notRequired(),
    position: Yup.string().notRequired(),
    message: Yup.string()
      .min(10, t("form.messageMin"))
      .required(t("form.messageRequired")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      linkedin: "",
      company: "",
      position: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        if (!window.grecaptcha) throw new Error("reCAPTCHA not loaded");
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        const captchaToken = await window.grecaptcha.execute(siteKey, {
          action: "submit",
        });
        const payload = { ...values, captchaToken };
        const { data } = await axios.post("/api/email/send", payload);
        if (data.success) {
          toast.success(t("form.submitSuccess"));
          resetForm();
        } else {
          toast.error(t("form.submitError"));
        }
      } catch (error) {
        toast.error(t("form.submitUnexpected"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        width: "100%",
        maxWidth: isMobile ? "95%" : 900,
        position: "relative",
        zIndex: 3,
        marginBottom: 60,
      }}
    >
      <Paper
        sx={{
          p: isMobile ? 3 : 5,
          borderRadius: 5,
          backdropFilter: "blur(18px)",
          border:
            theme.palette.mode === "dark"
              ? `1px solid ${alpha(theme.palette.common.white, 0.08)}`
              : `1px solid ${alpha(theme.palette.common.white, 0.55)}`,
          background:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.06)
              : alpha(theme.palette.common.white, 0.55),
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 20px 50px ${alpha(theme.palette.common.black, 0.45)}`
              : `0 20px 40px ${alpha(theme.palette.common.black, 0.15)}`,
        }}
      >
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 2 : 3,
          }}
          noValidate
        >
          {/* Row 1: First Name + Last Name */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: isMobile ? 2 : 3,
            }}
          >
            <TextField
              label={t("form.firstNameLabel")}
              name="firstName"
              fullWidth
              variant="outlined"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.06)
                      : alpha(theme.palette.common.white, 0.7),
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label={t("form.lastNameLabel")}
              name="lastName"
              fullWidth
              variant="outlined"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.06)
                      : alpha(theme.palette.common.white, 0.7),
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Row 2: Email + LinkedIn */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: isMobile ? 2 : 3,
            }}
          >
            <TextField
              label={t("form.emailLabel")}
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.06)
                      : alpha(theme.palette.common.white, 0.7),
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label={t("form.linkedinLabel")}
              name="linkedin"
              fullWidth
              variant="outlined"
              value={formik.values.linkedin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.linkedin && Boolean(formik.errors.linkedin)}
              helperText={formik.touched.linkedin && formik.errors.linkedin}
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.06)
                      : alpha(theme.palette.common.white, 0.7),
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Row 3: Company + Position */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: isMobile ? 2 : 3,
            }}
          >
            <TextField
              label={t("form.companyLabel")}
              name="company"
              fullWidth
              variant="outlined"
              value={formik.values.company}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.06)
                      : alpha(theme.palette.common.white, 0.7),
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label={t("form.positionLabel")}
              name="position"
              fullWidth
              variant="outlined"
              value={formik.values.position}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.position && Boolean(formik.errors.position)}
              helperText={formik.touched.position && formik.errors.position}
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.06)
                      : alpha(theme.palette.common.white, 0.7),
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Row 4: Message (full width) */}
          <TextField
            label={t("form.messageLabel")}
            name="message"
            fullWidth
            multiline
            rows={isMobile ? 6 : 8}
            variant="outlined"
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.message && Boolean(formik.errors.message)}
            helperText={formik.touched.message && formik.errors.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.06)
                    : alpha(theme.palette.common.white, 0.7),
                borderRadius: 2,
              },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{
                borderRadius: 3,
                px: isMobile ? 3 : 4,
                py: 1.8,
                fontSize: isMobile ? "0.95rem" : "1rem",
                fontWeight: 600,
                boxShadow: (theme) =>
                  `0px 4px 12px ${
                    theme.palette.primary
                      ? theme.palette.primary.main + "4D"
                      : "#1976d24D"
                  }, 0px 1px 5px ${
                    theme.palette.primary
                      ? theme.palette.primary.main + "26"
                      : "#1976d226"
                  }`,
                textTransform: "none",
                transition: "all 0.25s ease",
                "&:hover": {
                  background: (theme) =>
                    theme.palette.primary
                      ? theme.palette.primary.dark
                      : "#115293",
                  transform: "translateY(-2px)",
                  boxShadow: (theme) =>
                    `0px 6px 16px ${
                      theme.palette.primary
                        ? theme.palette.primary.main + "66"
                        : "#1976d266"
                    }, 0px 2px 8px ${
                      theme.palette.primary
                        ? theme.palette.primary.main + "33"
                        : "#1976d233"
                    }`,
                },
              }}
            >
              {t("form.submit")}
            </Button>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}
