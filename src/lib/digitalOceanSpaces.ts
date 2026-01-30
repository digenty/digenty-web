import { S3Client } from "@aws-sdk/client-s3";

export const spacesClient = new S3Client({
  region: process.env.DIGITAL_OCEAN_SPACES_REGION,
  endpoint: process.env.DIGITAL_OCEAN_SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DIGITAL_OCEAN_SPACES_KEY!,
    secretAccessKey: process.env.DIGITAL_OCEAN_SPACES_SECRET!,
  },
});
