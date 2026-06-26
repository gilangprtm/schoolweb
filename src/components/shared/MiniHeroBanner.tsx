import ScrollReveal from "./ScrollReveal";
import Breadcrumb from "./Breadcrumb";
import { cn } from "@/lib/utils";

interface MiniHeroBannerProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
}

export default function MiniHeroBanner({
  title,
  subtitle,
  breadcrumb,
  className,
}: MiniHeroBannerProps) {
  return (
    <section
      className={cn(
        "relative min-h-[30vh] md:min-h-[35vh] flex items-center overflow-hidden bg-linear-to-br from-primary via-primary-600 to-primary-800",
        className,
      )}
    >
      {/* Content */}
      <div className="container-custom relative z-10 pt-20 md:pt-24 pb-10">
        {breadcrumb && (
          <ScrollReveal delay={0} className="mb-3">
            <Breadcrumb items={breadcrumb} className="text-white/70" />
          </ScrollReveal>
        )}
        <ScrollReveal delay={0.1}>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-3">
            {title}
          </h1>
        </ScrollReveal>
        {subtitle && (
          <ScrollReveal delay={0.2}>
            <p className="text-base md:text-lg text-white/80 max-w-2xl">
              {subtitle}
            </p>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
