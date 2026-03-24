import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../store/auth.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-transparent backdrop-blur-md relative z-[100]">
      <div class="flex items-center gap-4">
        <a routerLink="/" class="text-3xl font-black tracking-tighter text-[#0ABAB5] uppercase pointer-events-auto" style="text-shadow: 0 0 15px rgba(10,186,181,0.4);">edu.ai</a>
      </div>
      
      <div class="flex items-center gap-8">
        <button (click)="toggleTheme()" 
                class="relative flex items-center w-20 h-10 rounded-full border-2 transition-all duration-300 focus:outline-none overflow-hidden pointer-events-auto"
                [class.border-[#0ABAB5]]="theme() === 'DARK'"
                [class.border-black]="theme() === 'LIGHT'"
                [class.bg-black]="theme() === 'DARK'"
                [class.bg-white]="theme() === 'LIGHT'"
                [style.box-shadow]="theme() === 'DARK' ? '0 0 20px rgba(10,186,181,0.6), inset 0 0 10px rgba(10,186,181,0.4)' : 'none'">
          
          <div class="absolute w-8 h-8 rounded-full transition-transform duration-300 flex items-center justify-center"
               [class.translate-x-10]="theme() === 'DARK'"
               [class.translate-x-1]="theme() === 'LIGHT'"
               [class.bg-[#0ABAB5]]="theme() === 'DARK'"
               [class.bg-black]="theme() === 'LIGHT'"
               [style.box-shadow]="theme() === 'DARK' ? '0 0 10px #0ABAB5' : 'none'">
            <i class="pi text-sm" 
               [ngClass]="theme() === 'DARK' ? 'pi-moon text-black' : 'pi-sun text-white'"></i>
          </div>
        </button>
        
        @if (isAuthenticated()) {
          <div class="flex items-center gap-3 relative group cursor-pointer pointer-events-auto">
            <div class="text-right hidden md:block">
              <div class="text-sm font-medium">{{ user()?.name }}</div>
              <div class="text-xs text-[#0ABAB5] uppercase tracking-wider">{{ user()?.role }}</div>
            </div>
            <div class="w-10 h-10 rounded-full bg-[#0ABAB5] text-black flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(10,186,181,0.5)]">
              {{ user()?.name?.charAt(0) }}
            </div>
            
            <div class="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
              <div class="bg-black rounded-xl overflow-hidden border border-[#0ABAB5]/30 shadow-[0_10px_30px_rgba(10,186,181,0.2)]">
                <a routerLink="/profile" class="block px-5 py-2 text-sm hover:bg-[#0ABAB5] hover:text-black transition-colors font-medium uppercase tracking-wider">Profile</a>
                <a routerLink="/settings" class="block px-5 py-2 text-sm hover:bg-[#0ABAB5] hover:text-black transition-colors font-medium uppercase tracking-wider">Settings</a>
                <button (click)="logout()" class="w-full text-left px-5 py-2 text-sm hover:bg-[#0ABAB5] hover:text-black transition-colors font-medium uppercase tracking-wider">Logout</button>
              </div>
            </div>
          </div>
        } @else {
          <a routerLink="/auth/login" class="px-6 py-2 rounded-full border-2 border-[#0ABAB5] text-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-black transition-all text-sm font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(10,186,181,0.3)] hover:shadow-[0_0_25px_rgba(10,186,181,0.6)] pointer-events-auto">Login</a>
        }
      </div>
    </header>
  `
})
export class HeaderComponent {
  theme = AuthStore.theme;
  isAuthenticated = AuthStore.isAuthenticated;
  user = AuthStore.user;

  toggleTheme() {
    AuthStore.toggleTheme();
  }

  logout() {
    AuthStore.logout();
  }
}