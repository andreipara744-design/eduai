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
    if (theme === 'LIGHT') {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
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
