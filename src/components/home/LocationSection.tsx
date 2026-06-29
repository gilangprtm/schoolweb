import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight, ExternalLink } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { getAllSettings } from "@/lib/actions/settings";

export default async function LocationSection() {
  const settings = await getAllSettings();
  const { address, phone, email, googleMapsEmbedUrl } = settings;

  return (
    <section className="section-py bg-white">
      <div className="container-custom">
        <ScrollReveal>
          <SectionHeading
            title="Lokasi Kami"
            subtitle="Kunjungi langsung SMP Negeri 17 Denpasar dan lihat sendiri lingkungan belajar kami"
          />
        </ScrollReveal>

        <div className="grid md:grid-cols-5 gap-8 max-w-5xl mx-auto items-center">
          {/* Map */}
          <ScrollReveal className="md:col-span-3" delay={0.1} direction="left">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-neutral-100 relative">
              <iframe
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi SMP Negeri 17 Denpasar"
                className="absolute inset-0"
              />
            </div>
          </ScrollReveal>

          {/* Info */}
          <ScrollReveal className="md:col-span-2" delay={0.2} direction="right">
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                  <MapPin className="size-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-neutral-800 text-sm mb-1">
                    Alamat
                  </h4>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                  <Phone className="size-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-neutral-800 text-sm mb-1">
                    Telepon
                  </h4>
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="text-primary hover:text-primary-700 text-sm font-medium"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                  <Mail className="size-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-neutral-800 text-sm mb-1">
                    Email
                  </h4>
                  <a
                    href={`mailto:${email}`}
                    className="text-primary hover:text-primary-700 text-sm font-medium"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-primary transition-colors"
                >
                  <ExternalLink className="size-4" />
                  Buka di Google Maps
                </a>
                <Link
                  href="/kontak"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-700 font-medium transition-colors"
                >
                  Kirim Pesan
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
