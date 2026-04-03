import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/updateLogo (1).png"
        alt="Adstacker"
        width={32}
        height={32}
        className="h-8 w-8 rounded"
      />
      {!iconOnly && (
        <span className="text-lg font-bold text-white">
          Ad<span className="gradient-text">stacker</span>
        </span>
      )}
    </Link>
  );
}
