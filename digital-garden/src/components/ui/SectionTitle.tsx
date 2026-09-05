import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/utils/animations';

interface SectionTitleProps {
  en: string;
  zh: string;
  children?: ReactNode;
  align?: 'left' | 'center';
}

const SectionTitle = ({ en, zh, children, align = 'left' }: SectionTitleProps) => {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={`flex flex-col ${alignClass} gap-3 mb-12 md:mb-16`}
    >
      <span className="font-display-en text-sm text-text-muted">{en}</span>
      <h2 className="font-display-zh text-h2">{zh}</h2>
      {children && <div className="max-w-2xl text-text-secondary">{children}</div>}
    </motion.div>
  );
};

export default SectionTitle;
