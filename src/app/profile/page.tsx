import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) {
    redirect("/login");
  }

  const { data: user } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single();
  
  if (!user) {
    redirect("/login");
  }
  
  // Need to include email from auth user to the object passed to client
  const profileData = {
    ...user,
    email: authUser.email
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Profil</h1>
      <ProfileClient user={profileData} />
    </div>
  );
}
