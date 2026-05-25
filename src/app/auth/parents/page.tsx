import { redirect } from "next/navigation";

export default function ParentAuthPage() {
  redirect("/auth/parents/login");
}
