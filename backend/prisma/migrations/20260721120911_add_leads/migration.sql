-- CreateTable
CREATE TABLE "ConsultationBooking" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "preferredDate" TEXT NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsultationBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectInquiry" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "linkedin" TEXT,
    "website" TEXT,
    "services" TEXT[],
    "projectTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "businessGoal" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "expectedFeatures" TEXT NOT NULL,
    "preferredTechnologies" TEXT,
    "existingWebsite" TEXT,
    "budget" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "deadline" TEXT,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectInquiry_pkey" PRIMARY KEY ("id")
);
