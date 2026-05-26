"use client";

import { create } from "zustand";
import type { Role, User } from "@/types";

interface UserState {
  user: User | null;
  selectedRole: Role;
  isLoggedIn: boolean;
  setSelectedRole: (role: Role) => void;
  login: (user: User) => void;
}

// Store responsibility: client-only session identity for the existing prototype flow.
export const useUserStore = create<UserState>((set) => ({
  user: null,
  selectedRole: "Admin",
  isLoggedIn: false,
  setSelectedRole: (selectedRole) => set({ selectedRole }),
  login: (user) => set({ user, isLoggedIn: true }),
}));
