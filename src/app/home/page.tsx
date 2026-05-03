import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">안녕하세요 👋</h1>
      <p className="text-muted-foreground text-sm">{user.email}</p>
    </div>
  );
}
