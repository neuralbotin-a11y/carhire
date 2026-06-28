import { supabase } from '@/lib/supabase';

export interface CarModel {
  id: string;
  name: string;
  category: string;
  fuel: string;
  transmission: string;
  seats: number;
  price_per_day: number;
  security_deposit: number;
  image_urls: string[];
  is_active: boolean;
}

export async function getActiveCars(): Promise<CarModel[]> {
  const { data, error } = await supabase
    .from('car_models')
    .select('*')
    .eq('is_active', true)
    .order('price_per_day', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CarModel[];
}
