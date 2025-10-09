/*
  Warnings:

  - A unique constraint covering the columns `[device_id]` on the table `traffics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "traffics_device_id_key" ON "public"."traffics"("device_id");
