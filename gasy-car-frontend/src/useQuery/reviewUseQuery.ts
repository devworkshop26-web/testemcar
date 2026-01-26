

import { reviewAPI } from "@/Actions/reveiewApi";
import { UpdateReviewPayload } from "@/types/reveiewType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: reviewAPI.getAll,
  });
};


export const useReview = (id: string) => {
  return useQuery({
    queryKey: ["review", id],
    queryFn: () => reviewAPI.getOne(id),
    enabled: !!id,
  });
};


export const useReviewsByReservation = (reservationId: string) => {
  return useQuery({
    queryKey: ["reviews", "reservation", reservationId],
    queryFn: () => reviewAPI.getByReservation(reservationId),
    enabled: !!reservationId,
  });
};


export const useReviewsWrittenByUser = (userId: string) => {
  return useQuery({
    queryKey: ["reviews", "writtenBy", userId],
    queryFn: () => reviewAPI.getWrittenByUser(userId),
    enabled: !!userId,
  });
};

export const useReviewsReceivedByUser = (userId: string) => {
  return useQuery({
    queryKey: ["reviews", "receivedBy", userId],
    queryFn: () => reviewAPI.getReceivedByUser(userId),
    enabled: !!userId,
  });
};

export const useCreateReview = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: reviewAPI.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useUpdateReview = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReviewPayload }) =>
      reviewAPI.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};


export const useDeleteReview = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: reviewAPI.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
