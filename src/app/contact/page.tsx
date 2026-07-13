import React from "react";
import { FAQSection } from "@/components/sections/faq";
import { Mail, MapPin, Phone, Clock, MessageCircle, ArrowRight, FileText, CalendarCheck, CheckCircle } from "lucide-react";
import { Section } from "@/components/layout/section";
import { ContactFormArea } from "@/components/sections/contact-form-area";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contact HawkEdge | Book a Free Consultation or Start Your Project",
  description:
    "Contact HawkEdge Technologies to book a free 30-minute consultation or submit a project brief. Get expert software engineering support with full transparency and no hidden costs.",
};

const NEXT_STEPS = [
  {
    step: "01",
    icon: FileText,
    title: "Submit your enquiry",
    time: "~2 minutes",
    description: "Fill out the form with as much or as little detail as you have. We'll ask follow-up questions if we need more context.",
  },
  {
    step: "02",
    icon: Clock,
    title: "We review and respond",
    time: "Within 24 hours",
    description: "A senior member of our team reviews your enquiry and responds with initial thoughts and next-step options.",
  },
  {
    step: "03",
    icon: CalendarCheck,
    title: "30-minute discovery call",
    time: "No commitment required",
    description: "We schedule a structured discovery call to understand your goals, constraints, and timeline. No sales pitch. Just honest conversation.",
  },
  {
    step: "04",
    icon: CheckCircle,
    title: "Detailed proposal",
    time: "Within 3 business days",
    description: "You receive a transparent proposal with full scope, timeline, technology plan, and cost breakdown — ready for your team to review.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-soft-blue/40 pt-32 pb-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-secondary mb-6 animate-fade-in">
            Let&apos;s Build Something{" "}
            <span className="text-primary">Remarkable</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Start with a project brief for a detailed proposal, or book a free 30-minute consultation to discuss your ideas. Either way, we respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 order-2 lg:order-1 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <ContactFormArea />
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-1 order-1 lg:order-2 space-y-6 animate-slide-up" style={{ animationDelay: "300ms" }}>

            {/* Contact Details */}
            <div className="bg-white rounded-2xl border border-border-color p-8 shadow-sm">
              <h3 className="text-xl font-bold font-heading text-secondary mb-6">Contact Information</h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-soft-blue flex items-center justify-center shrink-0">
                    <Mail className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-0.5">Business Email</p>
                    <a href="mailto:hawkedgetechonology@gmail.com" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                      hawkedgetechonology@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-soft-blue flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-0.5">Phone</p>
                    <a href="tel:+18001234567" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                      +1 (800) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-soft-blue flex items-center justify-center shrink-0">
                    <Clock className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-0.5">Business Hours</p>
                    <p className="text-sm text-foreground/70">Monday – Friday · 9AM – 6PM</p>
                    <p className="text-xs text-foreground/50 mt-0.5">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-soft-blue flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-0.5">Office</p>
                    <p className="text-sm text-foreground/70">123 Innovation Drive, Silicon Valley, CA 94043</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-color">
                  <a href="https://wa.me/18001234567" target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button variant="outline" className="w-full gap-2 border-green-500 text-green-600 hover:bg-green-50" id="whatsapp-contact">
                      <MessageCircle size={16} /> Chat on WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl border border-border-color p-2 shadow-sm overflow-hidden h-[240px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.63929062107!2d-122.08627838469248!3d37.42199987982559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425def45%3A0x8a5019a5f8ce411!2sGoogleplex!5e0!3m2!1sen!2sus!4v1682449079965!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(100%) opacity(80%)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HawkEdge Office Location"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* What Happens Next */}
      <Section background="white">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-secondary mb-4 tracking-tight">
            What Happens After You Contact Us
          </h2>
          <p className="text-lg text-foreground/65">
            No ambiguity. No waiting in the dark. Here&apos;s exactly what to expect from the moment you reach out.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-7 top-7 bottom-7 w-px bg-border-color hidden md:block" />

            <div className="space-y-6">
              {NEXT_STEPS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex gap-6 group">
                    <div className="shrink-0 relative z-10">
                      <div className="w-14 h-14 rounded-full bg-soft-blue border-2 border-border-color group-hover:border-primary group-hover:bg-primary flex items-center justify-center transition-all duration-300">
                        <Icon size={20} className="text-secondary group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="bg-light-gray rounded-2xl border border-border-color px-8 py-6 flex-1 group-hover:border-primary/20 group-hover:shadow-sm transition-all duration-300">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold font-heading text-secondary">{item.title}</h3>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/65 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-foreground/50 mb-6">
              First consultation is always free. No commitment required.
            </p>
            <a href="#top">
              <Button variant="primary" size="lg" className="gap-2 hover-elevate" id="contact-page-cta">
                Get Started Now <ArrowRight size={18} />
              </Button>
            </a>
          </div>
        </div>
      </Section>

      <FAQSection />
    </>
  );
}
