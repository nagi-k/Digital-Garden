interface TagProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const Tag = ({ label, active, onClick }: TagProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs  border transition-colors ${
        active
          ? 'border-accent-terracotta text-accent-terracotta'
          : 'border-border text-text-secondary hover:border-text-secondary'
      }`}
    >
      {label}
    </button>
  );
};

export default Tag;
