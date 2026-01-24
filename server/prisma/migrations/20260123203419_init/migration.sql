-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'SCREENING', 'PHONE_INTERVIEW', 'TECHNICAL_INTERVIEW', 'ONSITE_INTERVIEW', 'OFFER_RECEIVED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

-- CreateEnum
CREATE TYPE "PriorityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "profilePictureUrl" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "resetToken" TEXT,
    "resetTokenExpires" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "positionTitle" TEXT NOT NULL,
    "jobDescription" TEXT,
    "jobUrl" TEXT,
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "salaryMin" DOUBLE PRECISION,
    "salaryMax" DOUBLE PRECISION,
    "salaryCurrency" TEXT DEFAULT 'USD',
    "locationCity" TEXT,
    "locationCountry" TEXT,
    "locationType" "LocationType",
    "source" TEXT,
    "priority" "PriorityLevel" NOT NULL DEFAULT 'MEDIUM',
    "notes" TEXT,
    "recruiterName" TEXT,
    "recruiterEmail" TEXT,
    "recruiterPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_history" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_tags" (
    "applicationId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "application_tags_pkey" PRIMARY KEY ("applicationId","tagId")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_history" ADD CONSTRAINT "application_history_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_tags" ADD CONSTRAINT "application_tags_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_tags" ADD CONSTRAINT "application_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
