"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MiniHeroBanner from "@/components/shared/MiniHeroBanner";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { siteSettings } from "@/data/settings";

export default function KontakPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.message) {
      setError("Mohon isi semua kolom yang wajib (*)");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Format email tidak valid");
      return;
    }

    setLoading(true);
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <>
      <MiniHeroBanner
        title="Hubungi Kami"
        subtitle="Kami siap membantu dan menjawab pertanyaan Anda"
        breadcrumb={[{ label: "Kontak" }]}
      />

      <section className="section-py bg-white">
        <div className="container-custom max-w-5xl">
          <div className="grid md:grid-cols-5 gap-10">
            {/* Contact Info */}
            <ScrollReveal className="md:col-span-2" direction="left">
              <div className="space-y-6">
                <ContactItem icon={MapPin} title="Alamat" content={siteSettings.address} />
                <ContactItem
                  icon={Phone}
                  title="Telepon"
                  content={siteSettings.phone}
                  href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, "")}`}
                />
                <ContactItem
                  icon={Mail}
                  title="Email"
                  content={siteSettings.email}
                  href={`mailto:${siteSettings.email}`}
                />
                <ContactItem icon={Clock} title="Jam Operasional" content={siteSettings.jamOperasional} />

                {/* Social */}
                <div className="pt-4">
                  <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                    Media Sosial
                  </h4>
                  <div className="flex gap-2">
                    {siteSettings.social.facebook && (
                      <a href={siteSettings.social.facebook} target="_blank" rel="noopener noreferrer"
                        className="size-10 rounded-lg bg-neutral-100 hover:bg-primary hover:text-white text-neutral-600 flex items-center justify-center transition-all">
                        f
                      </a>
                    )}
                    {siteSettings.social.instagram && (
                      <a href={siteSettings.social.instagram} target="_blank" rel="noopener noreferrer"
                        className="size-10 rounded-lg bg-neutral-100 hover:bg-primary hover:text-white text-neutral-600 flex items-center justify-center transition-all">
                        ig
                      </a>
                    )}
                    {siteSettings.social.youtube && (
                      <a href={siteSettings.social.youtube} target="_blank" rel="noopener noreferrer"
                        className="size-10 rounded-lg bg-neutral-100 hover:bg-primary hover:text-white text-neutral-600 flex items-center justify-center transition-all">
                        yt
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal className="md:col-span-3" direction="right" delay={0.1}>
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                  <CheckCircle className="size-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-lg text-emerald-800 mb-1">Pesan Terkirim!</h3>
                  <p className="text-emerald-600 text-sm">
                    Terima kasih! Pesan Anda telah kami terima dan akan kami balas secepatnya.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSubmitted(false)}
                  >
                    Kirim Pesan Lagi
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-neutral-50 rounded-2xl p-6 md:p-8">
                  <h3 className="font-heading font-bold text-lg text-neutral-800 mb-5">Kirim Pesan</h3>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <Input name="name" value={form.name} onChange={handleChange} placeholder="Masukkan nama Anda" className="rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="contoh@email.com" className="rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-1.5 block">No. Telepon</label>
                      <Input name="phone" value={form.phone} onChange={handleChange} placeholder="08XX-XXXX-XXXX" className="rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                        Pesan <span className="text-red-500">*</span>
                      </label>
                      <Textarea name="message" value={form.message} onChange={handleChange} placeholder="Tulis pesan Anda di sini..." rows={5} className="rounded-xl" />
                    </div>
                    <Button type="submit" className="w-full gap-2 rounded-full" size="lg" disabled={loading}>
                      {loading ? (
                        "Mengirim..."
                      ) : (
                        <>
                          <Send className="size-4" />
                          Kirim Pesan
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-white pb-16">
        <div className="container-custom">
          <div className="aspect-[21/9] md:aspect-[21/9] aspect-video rounded-2xl overflow-hidden shadow-lg bg-neutral-100 relative">
            <iframe
              src={siteSettings.googleMapsEmbedUrl}
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
        </div>
      </section>
    </>
  );
}

function ContactItem({
  icon: Icon,
  title,
  content,
  href,
}: {
  icon: React.ElementType;
  title: string;
  content: string;
  href?: string;
}) {
  const body = (
    <div className="flex items-start gap-4">
      <div className="size-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
        <Icon className="size-5 text-primary" />
      </div>
      <div>
        <h4 className="font-heading font-semibold text-neutral-800 text-sm mb-1">{title}</h4>
        {href ? (
          <a href={href} className="text-primary hover:text-primary-700 text-sm font-medium break-all">
            {content}
          </a>
        ) : (
          <p className="text-neutral-500 text-sm whitespace-pre-line">{content}</p>
        )}
      </div>
    </div>
  );

  return body;
}
