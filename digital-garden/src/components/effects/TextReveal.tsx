import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { maskReveal } from '@/utils/animations';

interface TextRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const TextReveal = ({ children, delay = 0, className = '' }: TextRevealProps) => {
  return (
    <span className={`mask-reveal ${className}`}>
      <motion.span
        variants={maskReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
};

export default TextReveal;
