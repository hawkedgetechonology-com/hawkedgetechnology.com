"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CheckCircle2, Send } from "lucide-react";
import { submitConsultation } from "@/app/actions";

const consultationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  company: z.string().optional(),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  purpose: z.string().min(1, "Please select a purpose"),
  message: z.string().min(10, "Please provide a brief message about your needs"),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

const PURPOSE_OPTIONS = [
  { label: "Software Development", value: "Software Development" },
  { label: "AI Solutions", value: "AI Solutions" },
  { label: "Website", value: "Website" },
  { label: "Mobile App", value: "Mobile App" },
  { label: "Cloud", value: "Cloud" },
  { label: "Digital Marketing", value: "Digital Marketing" },
  { label: "Other", value: "Other" },
];

export function ConsultationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      preferredDate: "",
      preferredTime: "",
      purpose: "",
      message: "",
    },
  });

  const onSubmit = async (data: ConsultationFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitConsultation(data);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setSubmitError(res.error || "Failed to submit. Please try again.");
      }
    } catch (err) {
      setSubmitError("A connection error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl border border-border-color p-8 md:p-12 text-center shadow-lg animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold font-heading text-secondary mb-4">Request Received!</h2>
        <p className="text-lg text-foreground mb-8">
          Thank you for reaching out. We have received your consultation request and will confirm your appointment shortly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="primary" onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
          <Button variant="outline" onClick={() => setIsSuccess(false)}>
            Book Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-border-color p-8 md:p-12 space-y-6 shadow-sm">
      {submitError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm">
          {submitError}
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-2xl font-bold font-heading text-secondary mb-2">Book a Free Consultation</h3>
        <p className="text-foreground/70">Schedule a 30-minute discovery call with our engineering experts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" placeholder="John Doe" {...register("fullName")} error={errors.fullName?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" placeholder="Acme Inc." {...register("company")} error={errors.company?.message} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Business Email *</Label>
            <Input id="email" type="email" placeholder="john@example.com" {...register("email")} error={errors.email?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" {...register("phone")} error={errors.phone?.message} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="preferredDate">Preferred Date *</Label>
            <Input id="preferredDate" type="date" {...register("preferredDate")} error={errors.preferredDate?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredTime">Preferred Time *</Label>
            <Input id="preferredTime" type="time" {...register("preferredTime")} error={errors.preferredTime?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose of Consultation *</Label>
          <Select id="purpose" options={PURPOSE_OPTIONS} {...register("purpose")} error={errors.purpose?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">How can we help you? *</Label>
          <Textarea id="message" placeholder="Briefly describe what you'd like to discuss..." {...register("message")} error={errors.message?.message} />
        </div>

        <div className="pt-4">
          <Button type="submit" variant="primary" size="lg" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Book Consultation"} 
            {!isSubmitting && <Send size={18} />}
          </Button>
        </div>
      </form>
  );
}
