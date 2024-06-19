import { create } from "zustand";
import { User } from "../types";

type UserStore = {
  user: Pick<User, "email" | "id"> | null;
  setUser: (user: Pick<User, "email" | "id">) => void;
  removeUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  removeUser: () => set({ user: null }),
}));

export const useGetUser = () => {
  const { user } = useUserStore();
  return user;
};
