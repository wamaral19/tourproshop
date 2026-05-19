import Link from "next/link";
import Image from "next/image";

export function SiteLogo({
  variant = "default",
  className,
}: {
  variant?: "default" | "footer";
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Tour Pro Shop — home"
      className={`inline-flex items-center gap-3 ${className ?? ""}`}
    >
      <Image
        src="/logo.svg"
        alt=""
        width={160}
        height={90}
        priority
        className={
          variant === "footer"
            ? "h-12 w-auto md:h-14"
            : "h-10 w-auto md:h-12"
        }
      />
      <span className="sr-only">Tour Pro Shop</span>
    </Link>
  );
}
