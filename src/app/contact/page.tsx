import type { Metadata } from "next";
import { Mail, Instagram, Twitter, MapPin } from "lucide-react";
import { readSiteSettings } from "@/lib/content";
import ContactForm from "@/components/ContactForm";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with The Sound Report editorial team."
};

export default function ContactPage() {
  const settings = readSiteSettings();

  return (
    <div className="container-editorial py-16">
      <AnimatedSection>
        <h1 className="font-display text-3xl font-black sm:text-4xl">Get in Touch</h1>
        <p className="mt-2 max-w-xl text-neutral-500 dark:text-neutral-400">
          Have a story idea, feedback, or want to say hi? We&rsquo;d love to hear from you.
        </p>
      </AnimatedSection>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <AnimatedSection delay={0.05}>
          <ContactForm />
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="space-y-4 text-sm">
          <ContactRow icon={Mail} label="hello@soundreport.in" href="mailto:hello@soundreport.in" />
          {settings.socials.instagram && (
            <ContactRow icon={Instagram} label="instagram.com/thesoundreport_in" href={settings.socials.instagram} />
          )}
          {settings.socials.twitter && (
            <ContactRow icon={Twitter} label="twitter.com/thesoundreport_" href={settings.socials.twitter} />
          )}
          <ContactRow icon={MapPin} label="Based in India · Reporting worldwide" />
        </AnimatedSection>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  href
}: {
  icon: React.ElementType;
  label: string;
  href?: string;
}) {
  const content = (
    <span className="flex items-center gap-3">
      <Icon className="text-accent" size={18} aria-hidden />
      {label}
    </span>
  );
  return (
    <div className="rounded-xl border border-black/5 p-4 dark:border-white/10">
      {href ? (
        <a href={href} className="hover:text-accent">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
