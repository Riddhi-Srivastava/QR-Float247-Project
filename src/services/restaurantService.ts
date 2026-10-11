import api from '../lib/api';

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string[];
  rating: number;
  ratingCount: number;
  image: string | null;
  logo: string | null;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  address: string;
  phone: string;
  tableCount: number;
  costForTwo: string;
  description: string;
}

interface RestaurantsResponse {
  success: boolean;
  count: number;
  restaurants: Restaurant[];
}

export const getRestaurants = async (): Promise<Restaurant[]> => {
  const response = await api.get<RestaurantsResponse>('/restaurants');
  return response.data.restaurants;
};
