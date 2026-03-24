import { signal, computed } from '@angular/core';

export type Role = 'GUEST' | 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
export type Theme = 'DARK' | 'LIGHT';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: Role;
}

const userSignal = signal<User | null>(null);
const themeSignal = signal<Theme>('DARK');

export const AuthStore = {
  user: userSignal,
  theme: themeSignal,
  
  setTheme: (theme: Theme) => {
    themeSignal.set(theme);
    // Verificăm dacă document există (pentru Vercel SSR)
    if (typeof document !== 'undefined') {
      if (theme === 'LIGHT') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        document.documentElement.classList.remove('dark'); // Adăugat pentru Tailwind
      } else {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        document.documentElement.classList.add('dark'); // Adăugat pentru Tailwind
      }
    }
  },
  
  toggleTheme: () => {
    AuthStore.setTheme(themeSignal() === 'DARK' ? 'LIGHT' : 'DARK');
  },
  
  login: (user: User) => userSignal.set(user),
  logout: () => userSignal.set(null),
  
  isAuthenticated: computed(() => userSignal() !== null),
  role: computed(() => userSignal()?.role || 'GUEST')
};


// FIX BUG: Aplic Dark Mode instant la prima randare

if (typeof document !== 'undefined') {
  document.body.classList.add('dark-mode');
  document.documentElement.classList.add('dark');
}