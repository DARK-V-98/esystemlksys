import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M11.6667 4.66667H7C5.89543 4.66667 5 5.5621 5 6.66667V21.3333C5 22.4379 5.89543 23.3333 7 23.3333H21.3333C22.4379 23.3333 23.3333 22.4379 23.3333 21.3333V16.3333"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 4.5L23.5 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.3333 4.66667V12H16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xl font-bold tracking-tight text-foreground">
        LinkVault
      </span>
    </div>
  );
}
