import { cn } from "@/lib/utils";

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false, ...props }: LogoProps) {
  const green = "#16A34A"; // Tailwind bg-green-600

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {iconOnly ? (
        // Icon-only version with green square + "I"
        <div
          className="w-8 h-8 rounded-sm flex items-center justify-center"
          style={{ backgroundColor: green }}
        >
          <span className="text-black font-bold text-sm">I</span>
        </div>
      ) : (
        // Full SVG logo
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          className={cn("h-10 w-10", className)}
          fill="none"
          stroke={green}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          {/* Pyramid base */}
          <path d="M16 42L32 54 48 42" />
          {/* Pyramid sides */}
          <path d="M32 10L16 42M32 10L48 42" />
          {/* Sun rays */}
          <g stroke={green} strokeWidth="1">
            <line x1="32" y1="2" x2="32" y2="10" />
            <line x1="22" y1="3" x2="32" y2="10" />
            <line x1="42" y1="3" x2="32" y2="10" />
            <line x1="12" y1="22" x2="20" y2="22" />
            <line x1="44" y1="22" x2="52" y2="22" />
          </g>
          {/* Eye of Horus detail */}
          <circle cx="32" cy="26" r="4" fill="#000000" /> {/* Optional black accent */}
        </svg>
      )}
      {!iconOnly && (
        <span className="font-bold text-foreground text-lg">Imhotep</span>
      )}
    </div>
  );
}
