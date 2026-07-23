import { LeadsService } from './leads.service';
import { Prisma } from '@prisma/client';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    createConsultation(data: Prisma.ConsultationBookingCreateInput): Promise<{
        success: boolean;
    }>;
    getConsultations(): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        fullName: string;
        phone: string;
        company: string | null;
        preferredDate: string;
        preferredTime: string;
        purpose: string;
        message: string | null;
    }[]>;
    createInquiry(data: Prisma.ProjectInquiryCreateInput): Promise<{
        success: boolean;
    }>;
    getInquiries(): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        fullName: string;
        phone: string | null;
        company: string | null;
        country: string | null;
        linkedin: string | null;
        website: string | null;
        services: string[];
        projectTitle: string;
        description: string;
        businessGoal: string;
        targetAudience: string;
        expectedFeatures: string;
        preferredTechnologies: string | null;
        existingWebsite: string | null;
        budget: string;
        timeline: string;
        deadline: string | null;
        fileUrl: string | null;
    }[]>;
}
