"use client";

import React, { useState } from "react";
import { ProjectInquiryForm } from "@/components/forms/project-inquiry-form";
import { ConsultationForm } from "@/components/forms/consultation-form";
import { Button } from "@/components/ui/button";

export function ContactFormArea() {
  const [activeTab, setActiveTab] = useState<"project" | "consultation">("project");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-xl border border-border-color p-2 flex flex-col sm:flex-row gap-2 shadow-sm">
        <Button
          variant={activeTab === "project" ? "primary" : "outline"}
          onClick={() => setActiveTab("project")}
          className={`flex-1 ${activeTab !== "project" ? "border-transparent bg-transparent text-foreground hover:bg-soft-blue" : ""}`}
        >
          Start Your Project
        </Button>
        <Button
          variant={activeTab === "consultation" ? "primary" : "outline"}
          onClick={() => setActiveTab("consultation")}
          className={`flex-1 ${activeTab !== "consultation" ? "border-transparent bg-transparent text-foreground hover:bg-soft-blue" : ""}`}
        >
          Book Consultation
        </Button>
      </div>

      {/* Form Area */}
      <div className="relative">
        {activeTab === "project" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProjectInquiryForm />
          </div>
        )}
        
        {activeTab === "consultation" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" id="consultation">
            <ConsultationForm />
          </div>
        )}
      </div>
    </div>
  );
}
