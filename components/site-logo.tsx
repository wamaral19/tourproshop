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
        alt="Tour Pro Shop"
        width={340}
        height={30}
        priority
        className={
          variant === "footer"
            ? "h-7 w-auto md:h-8"
            : "h-6 w-auto md:h-7"
        }
      />
      <span className="sr-only">Tour Pro Shop</span>
    </Link>
  );
}
