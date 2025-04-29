"use client";

import React, { useState, forwardRef } from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'default' | 'icon';

type BaseButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};

type LinkProps = BaseButtonProps &
                 Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'disabled'> &
                 { href: string; };

type ButtonElementProps = BaseButtonProps &
                          Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'type'> &
                          {
                            href?: never;
                            type?: 'submit' | 'reset' | 'button';
                          };

type ButtonProps = LinkProps | ButtonElementProps;

const hoverGradientOptions = [
    "bg-gradient-to-br from-secondary-500 via-green-500 to-lime-500",
    "bg-gradient-to-tr from-secondary-500 via-yellow-500 to-accent-500",
    "bg-gradient-to-bl from-lime-500 via-accent-500 to-green-500",
    "bg-gradient-to-tl from-yellow-500 via-destructive-500 to-secondary-500",
    "bg-gradient-to-r from-yellow-500 via-lime-500 to-green-500",
    "bg-gradient-to-l from-accent-500 via-light-500 to-secondary-500",
    "bg-gradient-to-b from-green-500 via-accent-500 to-yellow-500",
    "bg-gradient-to-t from-lime-500 via-secondary-500 to-light-500",
    "bg-gradient-to-br from-light-500 via-green-500 to-yellow-500",
    "bg-gradient-to-tl from-accent-500 via-lime-500 to-destructive-500",
    "bg-gradient-to-tr from-accent-500 to-destructive-500",
    "bg-gradient-to-bl from-yellow-500 to-secondary-500",
];

const Button = forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    ButtonProps
>((
  {
    variant = 'primary',
    size = 'default',
    className = '',
    children,
    disabled,
    ...props
  },
  ref
) => {

  const [hoverGradientClass, setHoverGradientClass] = useState<string | null>(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    const randomIndex = Math.floor(Math.random() * hoverGradientOptions.length);
    setHoverGradientClass(hoverGradientOptions[randomIndex]);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setHoverGradientClass(null);
  };

  const baseClasses = `inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap`;

  const safeVariantClasses: Record<ButtonVariant, string> = {
      primary: `button-primary-manual cursor-pointer bg-green-500 dark:bg-green-300 dark:text-accent-foreground disabled:bg-muted disabled:text-muted-foreground`,
      secondary: `border border-green-500 cursor-pointer text-green-500 dark:text-green-300 bg-transparent disabled:border-muted disabled:text-muted-foreground`,
      outline: `border border-border cursor-pointer bg-background text-foreground disabled:border-muted disabled:text-muted-foreground`,
  };

  const sizeClasses: Record<ButtonSize, string> = {
    default: 'h-10 px-4 py-2',
    icon: 'h-10 w-10',
  };

  const staticClasses = twMerge(
    baseClasses,
    sizeClasses[size],
    safeVariantClasses[variant],
    className
  );

  const finalClasses = twMerge(
    staticClasses,
    hoverGradientClass ? `${hoverGradientClass} text-white border-transparent` : ''
  );

  if ('href' in props && props.href) {
    const { href, ...linkProps } = props;
    if (disabled) {
       return (
          <span className={staticClasses} aria-disabled="true" ref={ref as React.ForwardedRef<HTMLSpanElement>}>
             {children}
          </span>
       );
    }
    return (
      <Link
        href={href}
        className={finalClasses}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...linkProps}
      >
        {children}
      </Link>
    );
  } else {
    const { type = 'button', ...buttonProps } = props as ButtonElementProps;
    return (
      <button
        type={type}
        className={finalClasses}
        disabled={disabled}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
});

Button.displayName = "Button";

export { Button };
export type { ButtonProps };