"use client";

import Link from "next/link";
import { useRef, type ComponentProps } from "react";
import { useMagnetic } from "@/lib/motion";

/** A next/link that gently follows the pointer within its own bounds on
 * hover-capable devices — identity transform (a plain link) everywhere else. */
export default function MagneticLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const magnetic = useMagnetic(ref, 0.25);

  return (
    <Link
      {...props}
      ref={ref}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      style={magnetic.style}
      className={className}
    >
      {children}
    </Link>
  );
}
