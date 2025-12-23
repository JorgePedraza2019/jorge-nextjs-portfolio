import React from "react";
import { useState } from "react";
import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import HighlightedWork from "./HighlightedWork";
import SkillRadar from "./SkillRadar";
import SkillHeader from "./SkillHeader";
import SkillList from "./SkillList/SkillList";
import { useTranslations } from "next-intl";

export default function SkillSection({ theme }) {
  const [skillType, setSkillType] = useState("hard"); // "hard" | "soft"
  const t = useTranslations("skills");

  const hardSkillCards = [
    {
      id: "frontend",
      level: 95,
      videoLight: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/dark/hero.mp4`,
      videoDark: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/light/hero.mp4`,
    },
    {
      id: "backend",
      level: 82,
      videoLight: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/dark/hero.mp4`,
      videoDark: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/light/hero.mp4`,
    },
    {
      id: "cloud",
      level: 75,
      videoLight: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/dark/hero.mp4`,
      videoDark: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/light/hero.mp4`,
    },
    {
      id: "data",
      level: 78,
      videoLight: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/dark/hero.mp4`,
      videoDark: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/light/hero.mp4`,
    },
  ];
  const softSkillCards = [
    {
      id: "communication",
      level: 88,
      videoLight: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/dark/hero.mp4`,
      videoDark: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/light/hero.mp4`,
    },
    {
      id: "leadership",
      level: 82,
      videoLight: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/dark/hero.mp4`,
      videoDark: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/light/hero.mp4`,
    },
    {
      id: "problem-solving",
      level: 90,
      videoLight: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/dark/hero.mp4`,
      videoDark: `${process.env.NEXT_PUBLIC_ASSETS_URL}/videos/projects/portfolio/light/hero.mp4`,
    },
  ];
  const hardHighlights = t.raw("hardHighlights");
  const softHighlights = t.raw("softHighlights");
  const techStack = t.raw("techStack");
  const softStack = t.raw("softStack");

  const radarHardData = techStack.slice(0, 6).map((key, i) => ({
    subject: key,
    A: [95, 90, 85, 80, 75, 88][i] || 75,
    fullMark: 100,
  }));

  const radarSoftData = softStack.map((key, i) => ({
    subject: key,
    A: [88, 82, 90, 85, 84, 86][i] || 80,
    fullMark: 100,
  }));

  const headerLabels = {
    hard: t("header.hard"),
    soft: t("header.soft"),
  };

  const translatedHardSkillCards = hardSkillCards.map((card) => ({
    ...card,
    title: t(`hardCards.${card.id}.title`),
    description: t(`hardCards.${card.id}.description`),
    tags: t.raw(`hardCards.${card.id}.tags`) || [],
  }));

  const translatedSoftSkillCards = softSkillCards.map((card) => ({
    ...card,
    title: t(`softCards.${card.id}.title`),
    description: t(`softCards.${card.id}.description`),
    tags: t.raw(`softCards.${card.id}.tags`) || [],
  }));

  return (
    <>
      <style jsx global>{`
        .chipMarqueeWrapper {
          position: relative;
          height: 48px;
          overflow: hidden;
          width: 100%;
          white-space: nowrap;
          mask-image: linear-gradient(
            to right,
            transparent 0px,
            ${alpha(theme.palette.common.black, 1)} 60px,
            ${alpha(theme.palette.common.black, 1)} calc(100% - 60px),
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0px,
            ${alpha(theme.palette.common.black, 1)} 60px,
            ${alpha(theme.palette.common.black, 1)} calc(100% - 60px),
            transparent 100%
          );
        }

        .chipMarquee {
          display: flex;
          flex-shrink: 0;
          white-space: nowrap;
          gap: 16px;
          position: absolute;
          top: 0;
          left: 0;
          width: max-content;
          animation: scrollChips 18s linear infinite;
        }

        .chipMarquee:hover {
          animation-play-state: paused;
        }

        .chipFadeLeft,
        .chipFadeRight {
          position: absolute;
          top: 0;
          width: 80px;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        .chipFadeLeft {
          left: 0;
          background: linear-gradient(
            to right,
            ${alpha(theme.palette.common.black, 0.6)},
            transparent
          );
        }

        .chipFadeRight {
          right: 0;
          background: linear-gradient(
            to left,
            ${alpha(theme.palette.common.black, 0.6)},
            transparent
          );
        }

        @keyframes scrollChips {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: 4, pt: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Tech Stack Row */}
          <SkillHeader
            skillType={skillType}
            onSkillChange={setSkillType}
            techStack={techStack}
            softStack={softStack}
            labels={headerLabels}
            theme={theme}
          />

          {/* Skill cards */}
          <SkillList
            items={
              skillType === "hard"
                ? translatedHardSkillCards
                : translatedSoftSkillCards
            }
            theme={theme}
          />

          {/* Highlighted Work */}
          <HighlightedWork
            skillType={skillType}
            theme={theme}
            hardHighlights={hardHighlights}
            softHighlights={softHighlights}
            labels={{
              titles: {
                hard: t("highlightedTitle.hard"),
                soft: t("highlightedTitle.soft"),
              },
              chips: {
                hard: t("highlightedTitle.impact"),
                soft: t("highlightedTitle.impact"),
              },
            }}
          />

          {/* Skill Radar */}
          <SkillRadar
            title={t(`radar.title.${skillType}`)}
            data={skillType === "hard" ? radarHardData : radarSoftData}
            color={
              skillType === "hard"
                ? theme.palette.primary.main
                : theme.palette.secondary.main
            }
            quickFacts={t.raw(`radar.quickFacts.${skillType}`)}
          />
        </motion.div>
      </Box>
    </>
  );
}
