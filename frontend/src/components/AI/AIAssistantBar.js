"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, InputBase, useTheme, Typography } from "@mui/material";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useTranslations } from "next-intl";

const MotionBox = motion(Box);

export default function AIAssistantBar() {
  const t = useTranslations("ai");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();
  const placeholders = [
    t("placeholder1"),
    t("placeholder2"),
    t("placeholder3"),
    t("placeholder4"),
  ];

  const inputContainerRef = useRef(null);
  const [inputHeight, setInputHeight] = useState(0);

  const [pendingClose, setPendingClose] = useState(false);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Lock scroll when open, but allow scroll in messages container. Prevent scroll propagation at container edges.
  // Lock scroll when open, but allow scroll in messages container.
  // Prevent scroll propagation only at container edges (desktop + mobile)
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (messages.length === 0) return;

    const messagesEl = messagesContainerRef.current;
    if (!messagesEl) return;

    // ---------- Desktop (wheel) ----------
    const handleWheel = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = messagesEl;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // ---------- Mobile (touch) ----------
    let lastY = null;

    const handleTouchStart = (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      lastY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length !== 1 || lastY === null) return;

      const currentY = e.touches[0].clientY;
      const diffY = lastY - currentY;

      const { scrollTop, scrollHeight, clientHeight } = messagesEl;
      const atTop = scrollTop <= 0;
      const atBottom = Math.abs(scrollTop + clientHeight - scrollHeight) < 1;

      if ((diffY < 0 && atTop) || (diffY > 0 && atBottom)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchEnd = () => {
      lastY = null;
    };

    messagesEl.addEventListener("wheel", handleWheel, { passive: false });
    messagesEl.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    messagesEl.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    messagesEl.addEventListener("touchend", handleTouchEnd, {
      passive: false,
    });

    return () => {
      messagesEl.removeEventListener("wheel", handleWheel);
      messagesEl.removeEventListener("touchstart", handleTouchStart);
      messagesEl.removeEventListener("touchmove", handleTouchMove);
      messagesEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, [open, messages.length]);
  // 2️⃣ Scroll automático al último mensaje
  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Escucha el evento global desde el Navbar
  useEffect(() => {
    function handleOpenAIBar() {
      setOpen(true);
      setPendingClose(false);
      setQuery(""); // limpia cualquier borrador al abrir
    }

    window.addEventListener("open-ai-bar", handleOpenAIBar);
    return () => window.removeEventListener("open-ai-bar", handleOpenAIBar);
  }, []);

  // Focus automático al abrir
  useEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => {
      inputRef.current?.focus();

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    });
  }, [open]);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cerrar con ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (inputContainerRef.current) {
      setInputHeight(inputContainerRef.current.offsetHeight);
    }
  }, [query]);

  // Rotate placeholder every 5 seconds
  useEffect(() => {
    if (query !== "") return; // don't rotate if user is typing

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [query]);

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = query;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);
    setIsTyping(true);

    setQuery("");

    const res = await axios.post("http://localhost:3001/rag/query", {
      prompt: userMessage,
    });

    const data = res.data;
    const fullText = data.answer;
    const sources = data.sources;

    let i = 0;

    const typeInterval = setInterval(() => {
      i++;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: fullText.slice(0, i),
          sources: i === fullText.length ? sources : undefined,
        };
        return updated;
      });

      if (i >= fullText.length) {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 15);
  };

  // Controls for framer motion animation of background position and scale combined
  const backgroundControls = useAnimation();

  useEffect(() => {
    if (open) {
      backgroundControls.start({
        backgroundPositionX: ["0%", "200%"],
        scale: isFocused ? 1.1 : 1,
        transition: {
          backgroundPositionX: {
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          },
          scale: { type: "spring", stiffness: 300, damping: 20 },
        },
      });
    } else {
      backgroundControls.stop();
    }
  }, [open, isFocused, backgroundControls]);

  return (
    <AnimatePresence>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1399 }}>
          {/* Backdrop oscuro */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 1399,
            }}
            onClick={() => {
              if (isFocused) {
                inputRef.current?.blur();
                setIsFocused(false);
                setPendingClose(true);
                return;
              }
              if (pendingClose) {
                setOpen(false);
                setPendingClose(false);
              } else {
                setPendingClose(true);
              }
            }}
          />

          {/* Chat messages */}
          {messages.length > 0 && (
            <Box
              ref={messagesContainerRef} // scrollable container
              sx={{
                position: "fixed",
                bottom: inputHeight + 65,
                left: 0,
                right: 0,
                maxWidth: { xs: 350, sm: 610 },
                mx: "auto",
                width: { xs: "95%", sm: "90%" },
                borderRadius: "20px",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(30, 30, 30, 0.95)"
                    : "rgba(245, 245, 245, 0.95)",
                px: 2,
                pt: 4,
                pb: 1.5,
                fontSize: { xs: 14, sm: 15 },
                zIndex: 1400,
                overflowY: "auto",
                maxHeight: "80%",
                boxShadow: "0 0 50px rgba(0,0,0,0.8)",
                display: "flex",
                flexDirection: "column",
              }}
              // ref={messagesEndRef}
            >
              {messages.map((msg, i) =>
                msg.role === "assistant" && msg.content === "" ? null : (
                  <Box
                    key={i}
                    sx={{
                      alignSelf:
                        msg.role === "user" ? "flex-end" : "flex-start",
                      backgroundColor:
                        msg.role === "user"
                          ? theme.palette.mode === "dark"
                            ? "#444"
                            : "#ccc" // más oscuro que antes
                          : "transparent", // asistente sin fondo
                      color:
                        msg.role === "user"
                          ? theme.palette.mode === "dark"
                            ? "#fff"
                            : "#000"
                          : theme.palette.mode === "dark"
                          ? "#fff"
                          : "#000",
                      borderRadius: "14px",
                      px: 1.5,
                      py: 1,
                      mb: 1,
                      maxWidth: "90%",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: 16, sm: 15 },
                        "& input": {
                          fontSize: { xs: 16, sm: 15 },
                        },
                      }}
                    >
                      {msg.content}
                    </Typography>
                    {msg.sources && msg.sources.length > 0 && (
                      <Box sx={{ mt: 1, fontSize: 12, opacity: 0.7 }}>
                        <strong>Sources:</strong>
                        {msg.sources.map((s, i) => (
                          <div key={i}>
                            • {s.source} {s.role && `– ${s.role}`}
                          </div>
                        ))}
                      </Box>
                    )}
                  </Box>
                )
              )}
              <div ref={messagesEndRef} />
              {/* Typing indicator: only show while waiting for assistant response, before any content is rendered */}
              {isTyping &&
                // Show the pulsing dots only if the last assistant message is still empty (i.e., before it starts rendering)
                messages.length > 0 &&
                messages[messages.length - 1].role === "assistant" &&
                messages[messages.length - 1].content === "" && (
                  <Box
                    sx={{
                      alignSelf: "flex-start",
                      display: "flex",
                      alignItems: "center",
                      height: 24,
                      mb: 1,
                      px: 1.5,
                      borderRadius: "14px",
                      backgroundColor: "transparent",
                      maxWidth: "90%",
                    }}
                    aria-live="polite"
                  >
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        initial={{ scale: 0.5, opacity: 0.6 }}
                        animate={{
                          scale: [0.5, 1, 0.5],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: dot * 0.2,
                          ease: "easeInOut",
                        }}
                        style={{
                          display: "inline-block",
                          width: 6,
                          height: 6,
                          marginLeft: dot === 0 ? 0 : 4,
                          borderRadius: "50%",
                          backgroundColor:
                            theme.palette.mode === "dark" ? "#ccc" : "#555",
                        }}
                      />
                    ))}
                  </Box>
                )}
              <div ref={messagesEndRef} />
            </Box>
          )}

          {/* Smooth continuous color-changing "lava lamp" background behind the input bar with blurred box-shadow effect */}
          <MotionBox
            animate={backgroundControls}
            initial={{ backgroundPositionX: "0%", scale: 1 }}
            sx={{
              position: "fixed",
              bottom: 27,
              left: 0,
              right: 0,
              width: { xs: "95%", sm: "90%" },
              maxWidth: { xs: 350, sm: 600 },
              margin: "0 auto",
              height: 66,
              borderRadius: 36,
              backgroundImage:
                "linear-gradient(270deg, #ff6ec4, #7873f5, #4ade80, #facc15, #f87171, #9333ea, #3b82f6, #ec4899, #ff6ec4, #7873f5, #4ade80)",
              backgroundSize: "1600% 1600%",
              zIndex: 1400,
              filter: "blur(16px)",
              opacity: 0.35,
              pointerEvents: "none",
              boxShadow: "0 0 15px rgba(0,0,0,0.3)",
              transformOrigin: "center center",
            }}
          />

          {/* Barra de input */}
          <MotionBox
            sx={{
              position: "fixed",
              bottom: 32,
              left: 0,
              right: 0,
              maxWidth: { xs: 350, sm: 600 },
              mx: "auto",
              width: { xs: "95%", sm: "90%" },
              borderRadius: "30px",
              overflow: "hidden",
              border: "3px solid transparent",
              backgroundColor: theme.palette.background.default,
              display: "flex",
              alignItems: "center",
              minHeight: { xs: 48, sm: 52 },
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.2, sm: 0.5 },
              zIndex: 1401,
            }}
            animate={{
              scale: isFocused ? 1.05 : 1,
            }}
            transition={{
              scale: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            <Box
              ref={inputContainerRef}
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <InputBase
                multiline
                maxRows={4}
                placeholder=""
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  setIsFocused(true);
                  setPendingClose(false);
                }}
                onBlur={() => setIsFocused(false)}
                inputRef={inputRef}
                autoFocus
                inputProps={{
                  style: { paddingLeft: 12 },
                  "aria-label": "search",
                }} // paddingLeft matches placeholder left
                sx={{
                  flex: 1,
                  width: "100%",
                  backgroundColor: theme.palette.background.default,
                  fontSize: { xs: 16, sm: 15 },
                  lineHeight: 1.4,
                  overflowY: "auto",
                  color: "inherit",
                  paddingTop: { xs: "9px", sm: "12px" },
                  paddingBottom: { xs: "9px", sm: "12px" },
                  "& textarea": {
                    backgroundColor: theme.palette.background.default,
                    color: "inherit",
                    fontSize: { xs: 16, sm: 15 },
                    lineHeight: 1.4,
                    padding: 0,
                    margin: 0,
                    resize: "none",
                  },
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // evita el salto de línea
                    await handleSendMessage();
                  }
                }}
              />
              {/* Rotating placeholder */}
              <AnimatePresence mode="wait" initial={false}>
                {query === "" && (
                  <motion.div
                    key={placeholderIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: theme.palette.text.disabled,
                      fontSize: 16,
                      userSelect: "none",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                      zIndex: 10,
                    }}
                    aria-hidden="true"
                  >
                    {placeholders[placeholderIndex]}
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
            <IconButton
              onClick={() => setOpen(false)}
              aria-label="Cerrar asistente"
              size="small"
              sx={{
                ml: 1,
                color: theme.palette.mode === "dark" ? "#aaa" : "#555",
                "&:hover": {
                  color: theme.palette.mode === "dark" ? "#fff" : "#222",
                  backgroundColor: "transparent",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </MotionBox>
        </div>
      )}
    </AnimatePresence>
  );
}
