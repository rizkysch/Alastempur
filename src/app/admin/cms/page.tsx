import { createClient } from "@/utils/supabase/server";
import CmsClient from "./CmsClient";

export default async function AdminCmsPage() {
  const supabase = await createClient();
  const { data: cmsData } = await supabase.from("cms").select("*").eq("id", 1).single();

  const mappedCms = cmsData ? {
    phone: cmsData.phone,
    email: cmsData.email,
    address: cmsData.address,
    heroText: cmsData.hero_text,
    aboutText: cmsData.about_text
  } : {
    phone: "", email: "", address: "", heroText: "", aboutText: ""
  };
  
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Manajemen Konten (CMS)</h1>
      <CmsClient initialCms={mappedCms} />
    </div>
  );
}
