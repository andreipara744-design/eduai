import { Component, PLATFORM_ID, inject, signal, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { Canvas3DComponent } from './components/canvas-3d/canvas-3d.component';
import { UIStore } from './store/ui.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent, Canvas3DComponent],
  template: `
    @if (show3D() && isBrowser()) {
      <app-canvas-3d />
    }
    
    <div class="ui-shell flex flex-col h-screen" style="z-index: 50; pointer-events: none; position: relative;">
      @if (hasEntered()) {
        <app-header style="pointer-events: auto;" />
      }
      
      <div class="flex flex-1 overflow-hidden">
        @if (hasEntered()) {
          <app-sidebar style="pointer-events: auto;" />
        }
        <main id="main-scroll-container" class="flex-1 relative overflow-y-auto" [style.pointer-events]="hasEntered() ? 'auto' : 'none'">
          <router-outlet />
        </main>
      </div>
      
      @if (hasEntered()) {
        <app-footer style="pointer-events: auto;" />
      }
    </div>
  `
})
export class App implements OnInit {
  show3D = UIStore.show3DCanvas;
  hasEntered = UIStore.hasEntered;
  
  // Injectăm instrumentul care ne spune unde rulează codul
  private platformId = inject(PLATFORM_ID);
  
  // Semnalul nostru de siguranță
  isBrowser = signal(false);

  ngOnInit() {
    // Dacă codul a ajuns pe ecranul unui utilizator (are placă video/browser), dăm undă verde la 3D
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser.set(true);
    }
  }
}