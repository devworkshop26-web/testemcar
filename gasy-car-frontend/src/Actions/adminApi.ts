import { InstanceAxis } from "@/helper/InstanceAxios";

export const adminAPI = {
  // api for all user
  get_all_users: async () => {
    return await InstanceAxis.get("/users/users-all/");
  },

  get_all_clients: async () => {
    return await InstanceAxis.get("/users/users-client/");
  },

  get_all_prestataire: async () => {
    return await InstanceAxis.get("/users/users-prestataire/");
  },

  get_all_support: async () => {
    return await InstanceAxis.get("/users/users-support/");
  },
};
