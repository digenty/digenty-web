import ClassDetails from "@/components/CBT/ClassDetails";

export default function ClassDetailsPage({
  params,
}: Readonly<{
  params: Promise<{ classId: string }>;
}>) {
  return <ClassDetails params={params} />;
}
