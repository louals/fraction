import React from "react";
import { motion } from "framer-motion";
import Logo from "../../assets/images/logo 1.svg";

const Loader: React.FC = () => {
  return (
    <motion.img
      src={Logo}
      alt="Logo"
      className="w-6 h-6" // smaller so it fits in the button
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  );
};

export default Loader;
