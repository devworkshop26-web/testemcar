// api/marketing-hero-api.ts
import { InstanceAxis } from "@/helper/InstanceAxios";
import { MarketingHero, MarketingHeroFormValues } from "@/types/MarketingHeroType";

const buildFormData = (values: MarketingHeroFormValues): FormData => {
  const fd = new FormData();
  fd.append("name", values.name);
  fd.append("titre", values.titre);
  fd.append("description", values.description ?? "");
  fd.append("start_date", values.start_date);
  fd.append("end_date", values.end_date);
  fd.append("price", values.price);
  fd.append("active", String(values.active));

  if (values.imageFile) {
    fd.append("image", values.imageFile);
  }

  return fd;
};

export const marketingHeroAPI = {
  // GET /marketing/heros/
  get_all_heros: async () => {
    return await InstanceAxis.get<MarketingHero[]>("/marketing/heros/");
  },

  // GET /marketing/heros/:id/
  get_one_hero: async (id: string) => {
    return await InstanceAxis.get<MarketingHero>(`/marketing/heros/${id}/`);
  },

  // POST /marketing/heros/
  create_hero: async (values: MarketingHeroFormValues) => {
    const formData = buildFormData(values);
    return await InstanceAxis.post<MarketingHero>("/marketing/heros/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // PUT /marketing/heros/:id/
  update_hero: async (id: string, values: MarketingHeroFormValues) => {
    const formData = buildFormData(values);
    return await InstanceAxis.put<MarketingHero>(
      `/marketing/heros/${id}/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },

  // DELETE /marketing/heros/:id/
  delete_hero: async (id: string) => {
    return await InstanceAxis.delete<void>(`/marketing/heros/${id}/`);
  },
};
