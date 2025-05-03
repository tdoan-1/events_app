-- CreateTable
CREATE TABLE "conference" (
    "conference_id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "short_name" VARCHAR(20) NOT NULL,
    "loca" VARCHAR(100) NOT NULL,
    "dates" DATE NOT NULL,
    "website" VARCHAR(50),
    "logo" VARCHAR(100),

    CONSTRAINT "conference_pkey" PRIMARY KEY ("conference_id")
);

-- CreateTable
CREATE TABLE "flags" (
    "flag_id" SERIAL NOT NULL,
    "paper_id" INTEGER NOT NULL,

    CONSTRAINT "flags_pkey" PRIMARY KEY ("flag_id")
);

-- CreateTable
CREATE TABLE "markers" (
    "marker_id" SERIAL NOT NULL,
    "marker_desc" VARCHAR(50),

    CONSTRAINT "markers_pkey" PRIMARY KEY ("marker_id")
);

-- CreateTable
CREATE TABLE "own_talks" (
    "user_id" INTEGER NOT NULL,
    "talks_id" INTEGER NOT NULL,

    CONSTRAINT "own_talks_pkey" PRIMARY KEY ("user_id","talks_id")
);

-- CreateTable
CREATE TABLE "papers" (
    "paper_id" SERIAL NOT NULL,
    "Abstract" TEXT,
    "Title" TEXT,
    "Description" TEXT,
    "Author" TEXT,
    "user_id" INTEGER,

    CONSTRAINT "papers_pkey" PRIMARY KEY ("paper_id")
);

-- CreateTable
CREATE TABLE "reminder" (
    "reminder_id" SERIAL NOT NULL,
    "conference_id" SERIAL NOT NULL,
    "title" VARCHAR(100),
    "Event_time" TIME(6),

    CONSTRAINT "reminder_pkey" PRIMARY KEY ("reminder_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_desc" VARCHAR(30),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "session" (
    "session_id" SERIAL NOT NULL,
    "paper_id" INTEGER NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "talks" (
    "talks_id" SERIAL NOT NULL,
    "conference_id" INTEGER NOT NULL,
    "abstract" CHAR(250) NOT NULL,
    "authors" CHAR(30),
    "time_" TIME(6),
    "loca" VARCHAR(100) NOT NULL,
    "comments" VARCHAR(250),

    CONSTRAINT "talks_pkey" PRIMARY KEY ("talks_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "conference_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "announcement" (
    "announcement_id" SERIAL NOT NULL,
    "announcement_desc" VARCHAR(200),

    CONSTRAINT "announcement_pkey" PRIMARY KEY ("announcement_id")
);

-- CreateTable
CREATE TABLE "is_enabled" (
    "id" SERIAL NOT NULL,
    "desc" BOOLEAN,

    CONSTRAINT "is_enabled_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "schedule_id" SERIAL NOT NULL,
    "event_date" DATE NOT NULL,
    "event_time" TIME(6) NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "presentors" VARCHAR(30) NOT NULL,
    "conference_id" INTEGER NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "VerificationCode_email_code_idx" ON "VerificationCode"("email", "code");

-- AddForeignKey
ALTER TABLE "flags" ADD CONSTRAINT "flags_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers"("paper_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "own_talks" ADD CONSTRAINT "own_talks_talks_id_fkey" FOREIGN KEY ("talks_id") REFERENCES "talks"("talks_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers"("paper_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "talks" ADD CONSTRAINT "talks_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "conference"("conference_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "conference"("conference_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "conference"("conference_id") ON DELETE CASCADE ON UPDATE NO ACTION;
