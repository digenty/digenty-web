import { PutObjectCommand } from "@aws-sdk/client-s3";
import { spacesClient } from "@/lib/digitalOceanSpaces";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileExtension = file.name.split(".").pop();
  const key = `uploads/${randomUUID()}.${fileExtension}`;

  await spacesClient.send(
    new PutObjectCommand({
      Bucket: process.env.DIGITAL_OCEAN_SPACES_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read",
    }),
  );

  const url = `${process.env.DIGITAL_OCEAN_SPACES_ENDPOINT}/${process.env.DIGITAL_OCEAN_SPACES_BUCKET}/${key}`;

  return NextResponse.json({ url });
}
