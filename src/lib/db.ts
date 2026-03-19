import { supabase } from "@/integrations/supabase/client";

export interface Work {
  id: number;
  title: string;
  category: string;
  image: string;
  description?: string | null;
  images?: string[] | null;
  client?: string | null;
  duration?: string | null;
  tools?: string | null;
  created_at?: string;
}

// Portfolio Works
export const fetchWorks = async (): Promise<Work[]> => {
  const { data, error } = await supabase
    .from("portfolio_works")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addWork = async (work: Omit<Work, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from("portfolio_works")
    .insert(work)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateWork = async (id: number, work: Partial<Work>) => {
  const { id: _, created_at: __, ...rest } = work as any;
  const { error } = await supabase
    .from("portfolio_works")
    .update(rest)
    .eq("id", id);
  if (error) throw error;
};

export const deleteWork = async (id: number) => {
  const { error } = await supabase
    .from("portfolio_works")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

// Site Settings
export const getSetting = async (key: string): Promise<string> => {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();
  return data?.value || "";
};

export const setSetting = async (key: string, value: string) => {
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .eq("key", key)
    .single();

  if (existing) {
    await supabase.from("site_settings").update({ value }).eq("key", key);
  } else {
    await supabase.from("site_settings").insert({ key, value });
  }
};

// Site Stats
export const incrementStat = async (key: string) => {
  const { data } = await supabase
    .from("site_stats")
    .select("count")
    .eq("key", key)
    .single();

  const current = data?.count || 0;
  await supabase
    .from("site_stats")
    .update({ count: current + 1 })
    .eq("key", key);
};

export const getStats = async () => {
  const { data } = await supabase.from("site_stats").select("*");
  const stats: Record<string, number> = {};
  data?.forEach((row) => {
    stats[row.key] = row.count;
  });
  return stats;
};
