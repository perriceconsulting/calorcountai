import { create } from 'zustand';
import { fetchFavorites, addFavorite as addFavToDB, removeFavorite as removeFavFromDB } from '../services/favoritesService';

interface FavoritesStore {
  favorites: string[];
  loadFavorites: () => Promise<void>;
  addFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],
  // Load favorites from Supabase
  loadFavorites: async () => {
    const favs = await fetchFavorites();
    set({ favorites: favs });
  },
  // Add favorite in Supabase and update local state
  addFavorite: async (id: string) => {
    await addFavToDB(id);
    set((state) => ({ favorites: [...state.favorites, id] }));
  },
  // Remove favorite in Supabase and update local state
  removeFavorite: async (id: string) => {
    await removeFavFromDB(id);
    set((state) => ({ favorites: state.favorites.filter((fav) => fav !== id) }));
  },
  isFavorite: (id: string) => get().favorites.includes(id),
}));
