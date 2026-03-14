// queries/marketing-hero-query.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketingHeroAPI } from "@/Actions/MarketingHeroAPi";
import { MarketingHero, MarketingHeroFormValues } from "@/types/MarketingHeroType";

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export const useMarketingHerosQuery = () => {
  return useQuery<MarketingHero[]>({
    queryKey: ["marketing-heros-all"],
    queryFn: async () => {
      const { data } = await marketingHeroAPI.get_all_heros();
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_DAY_MS,
    retry: 2,
  });
};

export const useMarketingHeroQuery = (id?: string) => {
  return useQuery<MarketingHero>({
    queryKey: ["marketing-hero-one", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID hero manquant");
      const { data } = await marketingHeroAPI.get_one_hero(id);
      return data;
    },
    retry: 1,
  });
};

export const useCreateMarketingHeroMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: MarketingHeroFormValues) =>
      marketingHeroAPI.create_hero(values).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-heros-all"] });
    },
  });
};

export const useUpdateMarketingHeroMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: MarketingHeroFormValues;
    }) =>
      marketingHeroAPI.update_hero(id, values).then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["marketing-heros-all"] });
      queryClient.invalidateQueries({ queryKey: ["marketing-hero-one", id] });
    },
  });
};

export const useDeleteMarketingHeroMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      marketingHeroAPI.delete_hero(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-heros-all"] });
    },
  });
};
