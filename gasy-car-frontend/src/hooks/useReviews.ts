import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Review, CreateReviewPayload } from '@/types/reveiewType';
import { reviewAPI } from '@/Actions/reveiewApi';

export const useOwnerReviews = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['reviews', 'owner', userId],
        queryFn: () => reviewAPI.getReceivedByUser(userId!),
        enabled: !!userId,
    });
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateReviewPayload) => reviewAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
    });
};

export const useReviewEligibility = (vehicleId: string | undefined) => {
    return useQuery({
        queryKey: ['reviews', 'pending', vehicleId],
        queryFn: () => reviewAPI.getPendingReservations(vehicleId!),
        enabled: !!vehicleId,
    });
};

export const useVehicleReviews = (vehicleId: string | undefined) => {
    return useQuery({
        queryKey: ['reviews', 'vehicle', vehicleId],
        queryFn: () => reviewAPI.getByVehicle(vehicleId!),
        enabled: !!vehicleId,
    });
};
