"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio } from "@/components/ui/radio";
import { ChevronRight, ChevronLeft, UploadCloud, CheckCircle2, Edit2 } from "lucide-react";
import { submitProjectInquiry } from "@/app/actions";

const formSchema = z.object({
  // Step 1
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  country: z.string().min(2, "Country is required"),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  
  // Step 2
  services: z.array(z.string()).min(1, "Please select at least one service"),
  
  // Step 3
  projectTitle: z.string().min(5, "Project title is required"),
  description: z.string().min(10, "Please provide a brief description"),
  businessGoal: z.string().min(5, "Business goal is required"),
  targetAudience: z.string().min(5, "Target audience is required"),
  expectedFeatures: z.string().min(5, "Expected features are required"),
  preferredTechnologies: z.string().optional(),
  existingWebsite: z.string().optional(),
  
  // Step 4
  budget: z.string().min(1, "Budget is required"),
  
  // Step 5
  urgency: z.string().min(1, "Start timeline is required"),
  projectDeadline: z.string().min(1, "Project deadline is required"),
});

type FormValues = z.infer<typeof formSchema>;

const SERVICES_LIST = [
  "Custom Software Development",
  "Website Development",
  "E-Commerce Development",
  "Mobile App Development",
  "AI Solutions",
  "SaaS Product Development",
  "UI/UX Design",
  "Cloud Solutions",
  "DevOps",
  "API Development",
  "Business Automation",
  "Digital Marketing",
  "SEO",
  "Technology Consulting",
  "Other",
];

const BUDGET_RANGES = [
  "Under ₹50,000",
  "₹50,000 – ₹2 Lakhs",
  "₹2 Lakhs – ₹5 Lakhs",
  "₹5 Lakhs – ₹10 Lakhs",
  "₹10 Lakhs+",
];

const URGENCY_OPTIONS = [
  "Immediately",
  "Within 2 Weeks",
  "Within 1 Month",
  "Within 3 Months",
  "Flexible",
];

export function ProjectInquiryForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      country: "",
      linkedin: "",
      website: "",
      services: [],
      projectTitle: "",
      description: "",
      businessGoal: "",
      targetAudience: "",
      expectedFeatures: "",
      preferredTechnologies: "",
      existingWebsite: "",
      budget: "",
      urgency: "",
      projectDeadline: "",
    },
    mode: "onChange",
  });

  const { register, handleSubmit, formState: { errors }, trigger, watch } = form;

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) fieldsToValidate = ["fullName", "companyName", "email", "phone", "country"];
    if (step === 2) fieldsToValidate = ["services"];
    if (step === 3) fieldsToValidate = ["projectTitle", "description", "businessGoal", "targetAudience", "expectedFeatures"];
    if (step === 4) fieldsToValidate = ["budget"];
    if (step === 5) fieldsToValidate = ["urgency", "projectDeadline"];
    // Step 6 is file upload (no rigid zod validation in this demo)

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 7));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpToStep = (targetStep: number) => {
    setStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        ...data,
        // map FormValues to ProjectInquiryData
        timeline: data.urgency,
        deadline: data.projectDeadline,
      };
      const res = await submitProjectInquiry(payload);
      if (res.success) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitError(res.error || "Failed to submit project inquiry. Please try again.");
      }
    } catch (err) {
      setSubmitError("A connection error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl border border-border-color p-8 md:p-12 text-center shadow-lg animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold font-heading text-secondary mb-4">Thank you.</h2>
        <p className="text-lg text-foreground mb-8">
          Your project request has been received.<br />
          Our engineering team will review your requirements.<br />
          You will receive a response within one business day.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button type="button" variant="primary" onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
          <Button type="button" variant="outline" onClick={() => window.location.href = '#consultation'}>
            Book Consultation
          </Button>
        </div>
      </div>
    );
  }

  const values = watch();

  return (
    <div className="bg-white rounded-2xl border border-border-color shadow-lg overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-soft-blue px-6 py-4 border-b border-border-color flex justify-between items-center">
        <div className="text-sm font-medium text-secondary">
          Step {step} of 7: {
            step === 1 ? "About You" :
            step === 2 ? "Services" :
            step === 3 ? "Project Details" :
            step === 4 ? "Budget" :
            step === 5 ? "Timeline" :
            step === 6 ? "Documents" : "Review"
          }
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i <= step ? "bg-primary w-6" : "bg-border-color w-2"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 md:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Step 1: Contact Details */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-2xl font-bold font-heading text-secondary mb-2">About You</h3>
                <p className="text-foreground/70">Let&apos;s start with your basic information.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="John Doe" {...register("fullName")} error={errors.fullName?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input id="companyName" placeholder="Acme Inc." {...register("companyName")} error={errors.companyName?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Business Email *</Label>
                  <Input id="email" type="email" placeholder="john@example.com" {...register("email")} error={errors.email?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" {...register("phone")} error={errors.phone?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input id="country" placeholder="United States" {...register("country")} error={errors.country?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                  <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/johndoe" {...register("linkedin")} error={errors.linkedin?.message} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Company Website (Optional)</Label>
                  <Input id="website" type="url" placeholder="https://example.com" {...register("website")} error={errors.website?.message} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service Selection */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-2xl font-bold font-heading text-secondary mb-2">What Do You Need?</h3>
                <p className="text-foreground/70">Select all the services required for your project.</p>
                {errors.services && <p className="text-red-500 text-sm mt-2">{errors.services.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SERVICES_LIST.map((service) => (
                  <div key={service} className={`border rounded-lg p-4 cursor-pointer transition-colors ${watch("services").includes(service) ? 'border-primary bg-soft-blue' : 'border-border-color hover:border-primary/50'}`}>
                    <Checkbox
                      id={`service-${service}`}
                      label={service}
                      value={service}
                      {...register("services")}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Project Information */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-2xl font-bold font-heading text-secondary mb-2">Project Details</h3>
                <p className="text-foreground/70">Tell us about the project and its goals.</p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectTitle">Project Name *</Label>
                  <Input id="projectTitle" placeholder="e.g. Next-Gen Mobile Banking App" {...register("projectTitle")} error={errors.projectTitle?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea id="description" placeholder="Provide a detailed overview of what you want to build..." {...register("description")} error={errors.description?.message} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessGoal">Business Goal *</Label>
                    <Textarea id="businessGoal" placeholder="What is the primary objective?" className="min-h-[100px]" {...register("businessGoal")} error={errors.businessGoal?.message} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedFeatures">Expected Features *</Label>
                    <Textarea id="expectedFeatures" placeholder="List key features required..." className="min-h-[100px]" {...register("expectedFeatures")} error={errors.expectedFeatures?.message} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience *</Label>
                    <Input id="targetAudience" placeholder="e.g. B2B Enterprises" {...register("targetAudience")} error={errors.targetAudience?.message} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredTechnologies">Preferred Technologies (Optional)</Label>
                    <Input id="preferredTechnologies" placeholder="e.g. React, Node.js, AWS" {...register("preferredTechnologies")} error={errors.preferredTechnologies?.message} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="existingWebsite">Existing Website (Optional)</Label>
                    <Input id="existingWebsite" placeholder="URL of current product if any" {...register("existingWebsite")} error={errors.existingWebsite?.message} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Budget */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-2xl font-bold font-heading text-secondary mb-2">Project Budget</h3>
                <p className="text-foreground/70">Help us understand your investment range.</p>
              </div>
              
              <div className="space-y-4">
                {errors.budget && <p className="text-red-500 text-sm">{errors.budget.message}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {BUDGET_RANGES.map((range) => (
                    <div key={range} className={`border rounded-lg p-6 text-center cursor-pointer transition-colors ${watch("budget") === range ? 'border-primary bg-soft-blue shadow-sm' : 'border-border-color hover:border-primary/50'}`}>
                      <Radio
                        id={`budget-${range}`}
                        value={range}
                        label={range}
                        className="hidden" // hide the radio visually if we want, or keep it. Let's keep it but make it part of the block
                        {...register("budget")}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Timeline */}
          {step === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-2xl font-bold font-heading text-secondary mb-2">Timeline</h3>
                <p className="text-foreground/70">When do you want to start and launch?</p>
              </div>

              <div className="space-y-4">
                <Label className="text-base">When do you want to start? *</Label>
                {errors.urgency && <p className="text-red-500 text-sm">{errors.urgency.message}</p>}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {URGENCY_OPTIONS.map((urgency) => (
                    <div key={urgency} className={`border rounded-lg p-4 cursor-pointer transition-colors ${watch("urgency") === urgency ? 'border-primary bg-soft-blue' : 'border-border-color hover:border-primary/50'}`}>
                      <Radio
                        id={`urgency-${urgency}`}
                        value={urgency}
                        label={urgency}
                        {...register("urgency")}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-border-color">
                <div className="max-w-md space-y-2">
                  <Label htmlFor="projectDeadline">Project Deadline *</Label>
                  <Input id="projectDeadline" type="date" {...register("projectDeadline")} error={errors.projectDeadline?.message} />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: File Upload */}
          {step === 6 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-2xl font-bold font-heading text-secondary mb-2">Upload Documents</h3>
                <p className="text-foreground/70">Upload any supporting documents, wireframes, or requirements.</p>
              </div>
              
              <div className="space-y-4">
                <div
                  className="border-2 border-dashed border-border-color rounded-xl p-10 text-center bg-soft-blue/30 hover:bg-soft-blue/60 transition-colors cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                    <UploadCloud size={48} />
                  </div>
                  <p className="font-semibold text-secondary mb-2 text-lg">Click to upload or drag and drop</p>
                  <p className="text-sm text-foreground/70 mb-4 max-w-md mx-auto">
                    Accepted files: PDF, DOCX, PPTX, ZIP, PNG, JPG, Figma Links, Wireframes, Requirement Documents
                  </p>
                  <p className="text-xs text-foreground/50 mb-6">Maximum Size: 20 MB</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    Browse Files
                  </Button>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.docx,.doc,.ppt,.pptx,.png,.jpg,.jpeg,.zip"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const names = Array.from(files).map((f) => f.name).join(", ");
                        setUploadedFileName(names);
                      }
                    }}
                  />
                </div>
                {uploadedFileName && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <CheckCircle2 size={16} />
                    <span className="font-medium">Selected:</span> {uploadedFileName}
                  </div>
                )}
              </div>
            </div>
          )}


          {/* Step 7: Review */}
          {step === 7 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-2xl font-bold font-heading text-secondary mb-2">Review Your Inquiry</h3>
                <p className="text-foreground/70">Please review your details before submitting your project request.</p>
              </div>

              {submitError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm">
                  {submitError}
                </div>
              )}

              <div className="bg-soft-blue/30 rounded-xl p-6 md:p-8 space-y-8 border border-border-color text-sm md:text-base">
                
                {/* Section 1 */}
                <div className="relative">
                  <Button type="button" variant="outline" size="sm" onClick={() => jumpToStep(1)} className="absolute top-0 right-0 h-8 gap-2 bg-white">
                    <Edit2 size={14} /> Edit
                  </Button>
                  <h4 className="font-bold text-secondary border-b border-border-color pb-2 mb-4">About You</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    <div><span className="text-foreground/60">Name:</span> <span className="font-medium text-foreground">{values.fullName}</span></div>
                    <div><span className="text-foreground/60">Company:</span> <span className="font-medium text-foreground">{values.companyName}</span></div>
                    <div><span className="text-foreground/60">Email:</span> <span className="font-medium text-foreground">{values.email}</span></div>
                    <div><span className="text-foreground/60">Phone:</span> <span className="font-medium text-foreground">{values.phone}</span></div>
                    <div><span className="text-foreground/60">Country:</span> <span className="font-medium text-foreground">{values.country}</span></div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="relative pt-6 border-t border-border-color">
                  <Button type="button" variant="outline" size="sm" onClick={() => jumpToStep(2)} className="absolute top-6 right-0 h-8 gap-2 bg-white">
                    <Edit2 size={14} /> Edit
                  </Button>
                  <h4 className="font-bold text-secondary border-b border-border-color pb-2 mb-4">What Do You Need?</h4>
                  <div className="flex flex-wrap gap-2 pr-20">
                    {values.services.map((s) => (
                      <span key={s} className="bg-white border border-border-color px-3 py-1 rounded-full text-xs font-medium text-secondary">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Section 3 */}
                <div className="relative pt-6 border-t border-border-color">
                  <Button type="button" variant="outline" size="sm" onClick={() => jumpToStep(3)} className="absolute top-6 right-0 h-8 gap-2 bg-white">
                    <Edit2 size={14} /> Edit
                  </Button>
                  <h4 className="font-bold text-secondary border-b border-border-color pb-2 mb-4">Project Details</h4>
                  <div className="space-y-3 pr-20">
                    <div><span className="text-foreground/60">Project Name:</span> <span className="font-medium text-foreground">{values.projectTitle}</span></div>
                    <div><span className="text-foreground/60 block mb-1">Description:</span> <span className="text-foreground">{values.description}</span></div>
                    <div><span className="text-foreground/60">Target Audience:</span> <span className="font-medium text-foreground">{values.targetAudience}</span></div>
                  </div>
                </div>

                {/* Section 4 & 5 */}
                <div className="relative pt-6 border-t border-border-color">
                  <Button type="button" variant="outline" size="sm" onClick={() => jumpToStep(4)} className="absolute top-6 right-0 h-8 gap-2 bg-white">
                    <Edit2 size={14} /> Edit
                  </Button>
                  <h4 className="font-bold text-secondary border-b border-border-color pb-2 mb-4">Budget & Timeline</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 pr-20">
                    <div><span className="text-foreground/60">Budget:</span> <span className="font-medium text-foreground">{values.budget}</span></div>
                    <div><span className="text-foreground/60">Start Date:</span> <span className="font-medium text-foreground">{values.urgency}</span></div>
                    <div><span className="text-foreground/60">Deadline:</span> <span className="font-medium text-foreground">{values.projectDeadline}</span></div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-border-color">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className={step === 1 ? "invisible" : "bg-white"}
            >
              <ChevronLeft size={18} className="mr-2" /> Back
            </Button>
            
            {step < 7 ? (
              <Button type="button" variant="primary" onClick={nextStep}>
                Continue <ChevronRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Request Free Quote"} 
                {!isSubmitting && <ChevronRight size={18} className="ml-2" />}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
