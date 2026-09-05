import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  to?: string;
  variant?: 'primary' | 'secondary';
}

const Button = ({ children, to, variant = 'primary', ...props }: ButtonProps) => {
  const baseClass =
    'inline-flex items-center justify-center px-6 py-3 text-sm tracking-wide transition-all duration-300 ease-out-expo';

  const variantClass =
    variant === 'primary'
      ? 'border border-text-primary hover:bg-text-primary hover:text-text-inverse'
      : 'text-text-secondary hover:text-text-primary';

  if (to) {
    return (
      <Link to={to} className={`${baseClass} ${variantClass}`}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${baseClass} ${variantClass}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
