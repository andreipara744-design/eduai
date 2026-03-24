import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    @if (isVisible()) {
      <aside class="w-64 border-r border-white/10 h-full bg-transparent backdrop-blur-sm hidden md:block">
        <nav class="p-4 flex flex-col gap-2">
          @for (link of links(); track link.path) {
            <a [routerLink]="link.path" routerLinkActive="bg-[#0ABAB5] text-black" [routerLinkActiveOptions]="{exact: true}"
               class="px-4 py-3 text-sm uppercase tracking-wider hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-[#0ABAB5] pointer-events-auto">
              <i class="pi {{link.icon}} mr-3"></i>
              {{ link.label }}
            </a>
          }
        </nav>
      </aside>
    }
  `
})
export class SidebarComponent {
  private router = inject(Router);

  isVisible = computed(() => {
    const url = this.router.url;
    return !url.includes('/auth/') && AuthStore.isAuthenticated();
  });

  links = computed(() => {
    const role = AuthStore.role();
    if (role === 'STUDENT') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: 'pi-home' },
        { path: '/lessons', label: 'My Lessons', icon: 'pi-book' },
        { path: '/quizzes', label: 'My Quizzes', icon: 'pi-check-square' },
        { path: '/progress', label: 'Progress', icon: 'pi-chart-line' }
      ];
    }
    if (role === 'TEACHER') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: 'pi-home' },
        { path: '/classes', label: 'Classes', icon: 'pi-users' },
        { path: '/analytics', label: 'Analytics', icon: 'pi-chart-bar' }
      ];
    }
    if (role === 'PARENT') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: 'pi-home' },
        { path: '/child-progress', label: 'Child Progress', icon: 'pi-star' }
      ];
    }
    if (role === 'ADMIN') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: 'pi-home' },
        { path: '/users', label: 'Users', icon: 'pi-users' },
        { path: '/settings', label: 'Settings', icon: 'pi-cog' }
      ];
    }
    return [];
  });
}
