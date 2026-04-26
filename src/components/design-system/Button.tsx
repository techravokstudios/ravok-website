"use client";

/**
 * Button — design-system primitive.
 *
 * Variants enforce the rules from WEBSITE-TECHNICAL-RULES.md §6:
 *  - Always full pill (999px), never sharp corners
 *  - Sans uppercase 0.2em letter-spacing
 *  - Hover always lifts (translateY(-1px)) + cubic-bezier(.2,.6,.2,1)
 *  - Max one .primary per section (enforced by author, not the component)
 *
 * Use <Button as="a" href="..."> for links, <Button onClick={...}> for actions.
 */

import Link from "next/link";
import { ReactNode, ComponentPropsWithoutRef, MouseEventHandler } from "react";

type Variant = "primary" | "secondary" | "nav-cta";

type CommonProps = {
    variant?: Variant;
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
};

type ButtonAsLink = CommonProps & {
    href: string;
    onClick?: never;
} & Omit<ComponentPropsWithoutRef<"a">, "className" | "href">;

type ButtonAsButton = CommonProps & {
    href?: never;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "onClick" | "type">;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

const baseClasses =
    "inline-flex items-center justify-center gap-[0.6rem] rounded-full font-sans font-semibold text-[0.68rem] uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.6,0.2,1)]";

const variantClasses: Record<Variant, string> = {
    primary:
        "bg-ravok-gold text-[#1c1c1a] border border-ravok-gold px-6 py-[0.85rem] hover:bg-[#d4a54a] hover:-translate-y-px hover:shadow-[0_10px_25px_-10px_rgba(196,149,58,0.5)]",
    secondary:
        "bg-transparent text-[#e8e4dc] border border-[rgba(232,228,218,0.15)] px-6 py-[0.85rem] hover:border-ravok-gold hover:text-ravok-gold hover:-translate-y-px",
    "nav-cta":
        "bg-transparent text-ravok-gold border border-ravok-gold text-[0.66rem] px-[1.3rem] py-[0.7rem] hover:bg-ravok-gold hover:text-[#1c1c1a]",
};

export function Button(props: ButtonProps) {
    const variant: Variant = props.variant ?? "primary";
    const className = `${baseClasses} ${variantClasses[variant]} ${props.className ?? ""}`.trim();

    if ("href" in props && props.href) {
        const { href, children, icon, variant: _v, className: _c, ...rest } = props;
        return (
            <Link href={href} className={className} {...rest}>
                {children}
                {icon}
            </Link>
        );
    }

    const { children, icon, onClick, type = "button", variant: _v, className: _c, ...rest } = props as ButtonAsButton;
    return (
        <button type={type} onClick={onClick} className={className} {...rest}>
            {children}
            {icon}
        </button>
    );
}
