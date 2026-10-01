import api from '../lib/api';

export interface Food {
  id: string;
  name: string;
  description: string;
  price: string;
  veg: 'VEG' | 'NON_VEG';
  image: string | null;
  rating: number;
  ratingCount: number;
  prepTime: number;
  available: boolean;
  popular: boolean;
  featured: boolean;
  restaurantId: string;
  categoryId: string;
}

interface FoodsResponse {
  success: boolean;
  count: number;
  foods: Food[];
}

export const getFoods = async (): Promise<Food[]> => {
  const response = await api.get<FoodsResponse>('/food');
  return response.data.foods;
};