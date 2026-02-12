import { NavLink as RouterNavLink, NavLinkProps as RouterNavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends RouterNavLinkProps {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, pendingClassName, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        {...props}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
