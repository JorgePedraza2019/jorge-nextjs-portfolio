"use client";

import { useTranslations } from "next-intl";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
  const t = useTranslations("contact");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        // Ejecuta reCAPTCHA y obtiene el token
        if (!window.grecaptcha) {
          throw new Error("reCAPTCHA not loaded");
        }
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        const captchaToken = await window.grecaptcha.execute(siteKey, { action: "submit" });
        // Prepara el payload con el token
        const payload = { ...values, captchaToken };
        // Envía el formulario al endpoint
        const res = await fetch("/api/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          toast.success(data.message || "¡Correo enviado correctamente!");
          resetForm();
        } else {
          toast.error(data.message || "Ocurrió un error al enviar el correo.");
        }
      } catch (error) {
        toast.error(error?.message || "Ocurrió un error inesperado.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Toaster />
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        minHeight: isMobile ? "80vh" : "75vh",
        position: "relative",
        overflow: "hidden",
        paddingTop: isMobile ? 88 : 72,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: isMobile ? "80vh" : "75vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: isMobile ? 8 : 10,
          px: isMobile ? 2 : 2,
          overflow: "hidden",
          transition: "background 0.6s ease, color 0.6s ease",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')",
            opacity: (theme) => (theme.palette.mode === "dark" ? 0.12 : 0.07),
            pointerEvents: "none",
            zIndex: 0,
          },
        }}
      >
        {/* STRONGER GLOW */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: isMobile ? 400 : 600,
            height: isMobile ? 400 : 600,
            borderRadius: "50%",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? `radial-gradient(circle, ${alpha(
                    theme.palette.primary.main,
                    0.12
                  )}, transparent 70%)`
                : `radial-gradient(circle, ${alpha(
                    theme.palette.primary.main,
                    0.22
                  )}, transparent 70%)`,
            filter: "blur(85px)",
            zIndex: 1,
            transform: `translate(-50%, -50%)`,
          }}
        />

        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ zIndex: 2 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              textAlign: "center",
              mb: 2,
              letterSpacing: "-1px",
              fontSize: isMobile ? "2rem" : { xs: "2.2rem", md: "3.5rem" },
              color: (theme) => theme.palette.text.primary,
            }}
          >
            {t("title").replace(t("highlight"), "")}
            <Box
              component="span"
              sx={{ color: (theme) => theme.palette.primary.main }}
            >
              {t("highlight")}
            </Box>
            .
          </Typography>

          <Typography
            sx={{
              maxWidth: isMobile ? "90%" : 650,
              textAlign: "center",
              opacity: 0.75,
              mb: 3,
              fontSize: isMobile ? "1rem" : "1.15rem",
              lineHeight: 1.65,
              color: (theme) => theme.palette.text.secondary,
              mx: "auto",
            }}
          >
            {t("description")}
          </Typography>
        </motion.div>

        {/* SOCIAL ICONS */}
        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            display: "flex",
            gap: isMobile ? 1.5 : 2,
            mb: isMobile ? 5 : 8,
            justifyContent: "center",
          }}
        >
          <IconButton
            component="a"
            href="https://www.linkedin.com/in/jorge-pedraza-valdez-309878152"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderRadius: "12px",
              width: isMobile ? 36 : 44,
              height: isMobile ? 36 : 44,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.common.black, 0.05),
              "&:hover": {
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.12)
                    : alpha(theme.palette.common.black, 0.12),
                transform: "translateY(-2px)",
              },
              transition: "0.2s ease",
            }}
          >
            <LinkedInIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>

          <IconButton
            component="a"
            href="https://github.com/JorgePedraza2019"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderRadius: "12px",
              width: isMobile ? 36 : 44,
              height: isMobile ? 36 : 44,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.common.black, 0.05),
              "&:hover": {
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.12)
                    : alpha(theme.palette.common.black, 0.12),
                transform: "translateY(-2px)",
              },
              transition: "0.2s ease",
            }}
          >
            <GitHubIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Box>

        {/* FORM CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%",
            maxWidth: isMobile ? "95%" : 900,
            position: "relative",
            zIndex: 3,
          }}
        >
          <Paper
            sx={{
              p: isMobile ? 3 : 5,
              borderRadius: 5,
              backdropFilter: "blur(18px)",
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? `1px solid ${alpha(theme.palette.common.white, 0.08)}`
                  : `1px solid ${alpha(theme.palette.common.white, 0.4)}`,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.common.white, 0.08)
                  : alpha(theme.palette.common.white, 0.55),
              boxShadow: (theme) =>
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
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
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
                  error={
                    formik.touched.linkedin && Boolean(formik.errors.linkedin)
                  }
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
                  error={
                    formik.touched.company && Boolean(formik.errors.company)
                  }
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
                  error={
                    formik.touched.position && Boolean(formik.errors.position)
                  }
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
                error={
                  formik.touched.message && Boolean(formik.errors.message)
                }
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
                      `0px 4px 12px ${alpha(
                        theme.palette.primary.main,
                        0.3
                      )}, 0px 1px 5px ${alpha(
                        theme.palette.primary.main,
                        0.15
                      )}`,
                    textTransform: "none",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      background: (theme) => theme.palette.primary.dark,
                      transform: "translateY(-2px)",
                      boxShadow: (theme) =>
                        `0px 6px 16px ${alpha(
                          theme.palette.primary.main,
                          0.4
                        )}, 0px 2px 8px ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                    },
                  }}
                >
                  {t("form.submit")}
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </motion.div>
    </>
  );
}