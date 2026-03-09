export interface Review {
    id: string;
    reservation?: string; // UUID - optional since reviews can exist without reservation
    author: string; // UUID
    target: string; // UUID
    review_type: "CLIENT_TO_OWNER" | "OWNER_TO_CLIENT";
    rating: number;
    comment: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
    // Expanded fields if backend sends them (check serializer)
    author_details?: {
        first_name: string;
        last_name: string;
        image: string | null;
    };
}

export interface ReviewStats {
    average_rating: number;
    total_reviews: number;
    rating_breakdown?: {
        [key: number]: number;
    };
}
