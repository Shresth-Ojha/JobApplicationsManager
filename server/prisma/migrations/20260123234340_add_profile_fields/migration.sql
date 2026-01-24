-- AlterTable
ALTER TABLE "users" ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "education" JSONB,
ADD COLUMN     "experience" JSONB,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "resumeUrl" TEXT,
ADD COLUMN     "state" TEXT;
