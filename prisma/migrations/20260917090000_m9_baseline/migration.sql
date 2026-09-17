-- Bestehendes M9-Schema; bei vorhandenen Datenbanken einmalig als angewendet markieren.
CREATE TABLE "User" (
 "id" TEXT NOT NULL PRIMARY KEY, "username" TEXT NOT NULL, "avatar" TEXT NOT NULL,
 "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "xp" INTEGER NOT NULL DEFAULT 0,
 "streak" INTEGER NOT NULL DEFAULT 0, "lastActiveAt" DATETIME
);
CREATE TABLE "Course" (
 "id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL, "level" TEXT NOT NULL,
 "description" TEXT NOT NULL, "title_en" TEXT, "title_fr" TEXT,
 "description_en" TEXT, "description_fr" TEXT, "order" INTEGER NOT NULL
);
CREATE TABLE "Lesson" (
 "id" TEXT NOT NULL PRIMARY KEY, "courseId" TEXT NOT NULL, "title" TEXT NOT NULL,
 "language" TEXT NOT NULL, "theory" TEXT NOT NULL, "title_en" TEXT, "title_fr" TEXT,
 "theory_en" TEXT, "theory_fr" TEXT, "order" INTEGER NOT NULL,
 CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "Exercise" (
 "id" TEXT NOT NULL PRIMARY KEY, "lessonId" TEXT NOT NULL, "type" TEXT NOT NULL,
 "question" TEXT NOT NULL, "options" JSONB, "correctAnswer" TEXT NOT NULL, "hint" TEXT NOT NULL,
 "question_en" TEXT, "question_fr" TEXT, "options_en" JSONB, "options_fr" JSONB,
 "hint_en" TEXT, "hint_fr" TEXT, "xpReward" INTEGER NOT NULL DEFAULT 10,
 CONSTRAINT "Exercise_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "Progress" (
 "id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "exerciseId" TEXT NOT NULL,
 "completed" BOOLEAN NOT NULL DEFAULT false, "correct" BOOLEAN NOT NULL DEFAULT false,
 "attempts" INTEGER NOT NULL DEFAULT 0, "completedAt" DATETIME,
 CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT "Progress_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "Badge" (
 "id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "name" TEXT NOT NULL,
 "icon" TEXT NOT NULL, "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Badge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Course_level_order_idx" ON "Course"("level", "order");
CREATE INDEX "Lesson_courseId_order_idx" ON "Lesson"("courseId", "order");
CREATE INDEX "Exercise_lessonId_idx" ON "Exercise"("lessonId");
CREATE INDEX "Progress_userId_idx" ON "Progress"("userId");
CREATE UNIQUE INDEX "Progress_userId_exerciseId_key" ON "Progress"("userId", "exerciseId");
CREATE UNIQUE INDEX "Badge_userId_name_key" ON "Badge"("userId", "name");
