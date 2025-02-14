"use client"
import { motion } from "framer-motion"

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  activeColor?: string
  inactiveColor?: string
  knobColor?: string
  size?: "sm" | "md" | "lg"
}

export default function ToggleSwitch({
  checked,
  onChange,
  activeColor = "#ff69b4",
  inactiveColor = "#ffb6c1",
  knobColor = "#ffffff",
  size = "lg",
}: ToggleSwitchProps) {
  // Size mappings
  const sizes = {
    sm: { width: 36, height: 20, knob: 14 },
    md: { width: 48, height: 28, knob: 20 },
    lg: { width: 60, height: 34, knob: 26 },
  }

  const { width, height, knob } = sizes[size]

  return (
    <motion.button
      className="relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-primary overflow-hidden"
      style={{
        width,
        height,
        backgroundColor: checked ? activeColor : inactiveColor,
      }}
      initial={false}
      animate={{
        backgroundColor: checked ? activeColor : inactiveColor,
      }}
      transition={{ duration: 0.2 }}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      type="button"
    >
      <motion.div
        className="absolute rounded-full shadow-sm transition-colors duration-200"
        style={{
          width: knob,
          height: knob,
          backgroundColor: knobColor,
          top: (height - knob) / 2,
        }}
        animate={{
          x: checked ? width - knob - (height - knob) / 2 : (height - knob) / 2,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
    </motion.button>
  )
}

