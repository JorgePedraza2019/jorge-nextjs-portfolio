"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, InputBase, useTheme, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { sendMessageToChat } from "@/services/chatApi";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const MotionBox = motion(Box);

const boxShadowAnimation = {
  boxShadow: [
    "0 0 8px 3px rgba(255, 138, 0, 0.8), 0 0 20px 6px rgba(255, 138, 0, 0.4)",
    "0 0 8px 3px rgba(229, 46, 113, 0.8), 0 0 20px 6px rgba(229, 46, 113, 0.4)",
    "0 0 8px 3px rgba(155, 0, 255, 0.8), 0 0 20px 6px rgba(155, 0, 255, 0.4)",
    "0 0 8px 3px rgba(255, 138, 0, 0.8), 0 0 20px 6px rgba(255, 138, 0, 0.4)",
  ],
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "linear",
  },
};

export default function AIAssistantBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();

  const inputContainerRef = useRef(null);
  const [inputHeight, setInputHeight] = useState(0);

  const [pendingClose, setPendingClose] = useState(false);

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

    setIsFocused(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
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

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = query;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);
    setQuery("");

    const res = await fetch("/api/chat-stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let partial = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      partial += decoder.decode(value, { stream: true });
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: partial,
        };
        return updated;
      });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 1399 }}
        >
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
                  theme.palette.mode === "dark" ? "#000" : "#f5f5f5",
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
            >
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    backgroundColor:
                      msg.role === "user"
                        ? theme.palette.mode === "dark"
                          ? "#222"
                          : "#ddd"
                        : theme.palette.mode === "dark"
                        ? "#000"
                        : "#fff",
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
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
          )}

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
              ...(boxShadowAnimation.boxShadow && {
                boxShadow: boxShadowAnimation.boxShadow,
              }),
            }}
            transition={{
              scale: { type: "spring", stiffness: 300, damping: 20 },
              boxShadow: boxShadowAnimation.transition,
            }}
          >
            <Box
              ref={inputContainerRef}
              sx={{ flex: 1, display: "flex", alignItems: "center" }}
            >
              <InputBase
                multiline
                maxRows={4}
                placeholder={query ? "" : "¿Qué quieres saber sobre mí?"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  setIsFocused(true);
                  setPendingClose(false);
                }}
                onBlur={() => setIsFocused(false)}
                inputRef={inputRef}
                autoFocus
                sx={{
                  flex: 1,
                  backgroundColor: theme.palette.background.default,
                  fontSize: { xs: 16, sm: 15 },
                  "& input": {
                    fontSize: { xs: 16, sm: 15 },
                  },
                  px: { xs: 0.5, sm: 1 },
                  lineHeight: 1.4,
                  overflowY: "auto",
                  "& input": {
                    backgroundColor: theme.palette.background.default,
                    color: "inherit",
                    padding: { xs: "9px 0", sm: "12px 0" },
                    fontSize: { xs: 16, sm: 15 },
                    "& input": {
                      fontSize: { xs: 16, sm: 15 },
                    },
                    lineHeight: 1.4,
                  },
                }}
                inputProps={{ "aria-label": "search" }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // evita el salto de línea
                    await handleSendMessage();
                  }
                }}
              />
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
