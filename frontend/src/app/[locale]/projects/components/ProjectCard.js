"use client";

import {
  Box,
  Chip,
  Paper,
  Typography,
  Button,
  Modal,
  Backdrop,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export default function ProjectCard({ project }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const t = useTranslations("projects");

  // Selección de video según el modo
  const videoSrc =
    theme.palette.mode === "dark" ? project.videoDark : project.videoLight;

  return (
    <Box
      sx={{
        position: "relative",
        cursor: "pointer",
        transition: "all 0.25s ease",
        "&:hover": { transform: "translateY(-4px) scale(1.02)" },
      }}
    >
      <motion.div layoutId={`project-${project.slug}`}>
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: 4,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: 550,
            width: "100%",
            justifyContent: "space-between",
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(145deg, ${alpha(
                    theme.palette.background.paper,
                    0.95
                  )}, ${alpha(theme.palette.background.paper, 0.9)})`
                : `linear-gradient(145deg, ${alpha(
                    theme.palette.common.white,
                    1
                  )}, ${alpha(theme.palette.common.white, 0.95)})`,
            border:
              theme.palette.mode === "dark"
                ? `1px solid ${alpha(theme.palette.common.white, 0.06)}`
                : `1px solid ${alpha(theme.palette.common.black, 0.06)}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 20px 50px ${alpha(theme.palette.common.black, 0.45)}`
                : `0 20px 40px ${alpha(theme.palette.common.black, 0.15)}`,
          })}
        >
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* BADGE DEL AÑO */}
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: theme.palette.primary.main,
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.common.black
                    : theme.palette.primary.contrastText,
                px: 1.5,
                py: 0.3,
                borderRadius: 1.5,
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {project.year}
            </Box>

            {/* VIDEO CON FADE */}
            <motion.video
              key={`${process.env.NEXT_PUBLIC_ASSETS_URL}${videoSrc}`} // clave para animar al cambiar de tema
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${videoSrc}`}
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: "10px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />

            <Typography variant="h5" fontWeight={700} mt={1}>
              {project.title}
            </Typography>

            {/* CHIPS */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "nowrap",
                overflowX: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {project.chips.map((c, i) => (
                <Chip key={i} label={c} color="primary" variant="outlined" />
              ))}
            </Box>

            {/* DESCRIPCIÓN */}
            <Typography
              sx={{
                opacity: 0.8,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mt: 3,
              }}
            >
              {project.shortDescription}
            </Typography>
          </Box>

          {/* BOTÓN */}
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.8,
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: (theme) =>
                `0px 4px 20px ${alpha(theme.palette.common.black, 0.12)}`,
              textTransform: "none",
              transition: "all 0.25s ease",
            }}
          >
            {t("viewCaseStudy")}
          </Button>
        </Paper>
      </motion.div>

      <AnimatePresence>
        {open && (
          <Modal
            open={true}
            onClose={() => setOpen(false)}
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 400,
              sx: {
                backgroundColor: alpha(theme.palette.common.black, 0.4),
                zIndex: -1,
              },
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                width: "90vw",
                maxHeight: "90vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Paper
                sx={{
                  width: "100%",
                  maxHeight: "90vh",
                  p: 4,
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: `0 40px 120px ${alpha(
                    theme.palette.common.black,
                    0.4
                  )}`,
                  bgcolor: "background.paper",
                }}
              >
                {/* Scrollable content */}
                <Box sx={{ overflowY: "auto", flex: 1, pr: 1 }}>
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    gutterBottom
                    sx={{ mb: 3 }}
                  >
                    {project.title}
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 5 }}
                  >
                    {project.chips.map((c, i) => (
                      <Chip key={i} label={c} color="primary" />
                    ))}
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                    sx={{ mt: 2, mb: 1 }}
                  >
                    {t("projectOverview")}
                  </Typography>
                  <Typography sx={{ opacity: 0.8, mb: 4 }}>
                    {project.summary}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                    sx={{ mt: 2, mb: 2 }}
                  >
                    {t("projectDetails")}
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 3, mb: 2 }}>
                    {Array.isArray(project.longDescription) &&
                      project.longDescription.map((line, i) => (
                        <Box
                          key={i}
                          component="li"
                          sx={{ mb: 1, listStyle: "disc", opacity: 0.85 }}
                        >
                          {line}
                        </Box>
                      ))}
                  </Box>
                </Box>

                {/* Close button fixed at bottom */}
                <Box sx={{ mt: 2 }}>
                  <Button
                    onClick={() => setOpen(false)}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.8,
                      fontSize: "1rem",
                      fontWeight: 600,
                      boxShadow: (theme) =>
                        `0px 4px 20px ${alpha(
                          theme.palette.common.black,
                          0.12
                        )}`,
                      textTransform: "none",
                      transition: "all 0.25s ease",
                    }}
                    variant="contained"
                  >
                    {t("closeButton")}
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
}
