import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { toggleDarkMode } from "@/redux/themeSlice";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ThemeToggleIcon() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);
  const theme = useTheme();
  const [rotation, setRotation] = useState(0);

  const handleClick = () => {
    setRotation((prev) => prev + 360);
    dispatch(toggleDarkMode());
  };

  return (
    <IconButton
      onClick={handleClick}
      sx={{
        color: theme.palette.text.primary,
        "&:hover": { backgroundColor: theme.palette.action.hover },
      }}
    >
      <motion.div
        animate={{ rotate: rotation }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <FontAwesomeIcon
          icon={darkMode ? faMoon : faSun}
          size="xs"
          as={motion.svg}
          style={{ display: "flex" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </motion.div>
    </IconButton>
  );
}