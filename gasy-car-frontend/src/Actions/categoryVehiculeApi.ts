import { InstanceAxis } from "@/helper/InstanceAxios";
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/types/categoryType";

export const categoryVehiculeAPI = {
   // GET /vehicule/category/
  get_all_categorys: async () => {
    return await InstanceAxis.get<Category[]>("/vehicule/category/");
  },

  // GET /vehicule/marque/:id/
  get_one_category: async (id: string) => {
    return await InstanceAxis.get<Category>(`/vehicule/category/${id}/`);
  },

  // POST /vehicule/category/
  create_category: async (payload: CreateCategoryPayload) => {
    return await InstanceAxis.post<Category>("/vehicule/category/", payload);
  },

  // PUT /vehicule/category/:id/
  update_category: async (id: string, payload: UpdateCategoryPayload) => {
    return await InstanceAxis.put<Category>(`/vehicule/category/${id}/`, payload);
  },

  // DELETE /vehicule/category/:id/
  delete_category: async (id: string) => {
    return await InstanceAxis.delete<void>(`/vehicule/category/${id}/`);
  },
};

