import { Component, OnInit, OnDestroy, PLATFORM_ID, inject, computed, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollStore } from '../../store/scroll.store';
import { UIStore } from '../../store/ui.store';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { AuthStore } from '../../store/auth.store';
@Component({
  selector: 'app-landing',
  standalone: true,
  template: `
    @if (!hasEntered()) {
      <div class="fixed inset-0 flex flex-col items-center justify-end pb-24 pointer-events-none" 
           [class.text-white]="theme() === 'DARK'" 
           [class.text-black]="theme() === 'LIGHT'" 
           style="z-index: 10;">
        <div class="text-center">
          <h1 class="text-3xl font-bold tracking-tighter mb-2 uppercase">edu.ai</h1>
          <p class="text-xs uppercase tracking-widest opacity-70 animate-pulse">Apasa pe carte pentru a incepe</p>
        </div>
      </div>
    } @else {
      <div class="landing-scroll-container" style="height: 500vh; width: 100%;">
        
        @if (progress() < 0.2) {
          <div class="fixed inset-0 pointer-events-none" 
               style="z-index: 10; transition: opacity 0.1s ease-out;" 
               [style.opacity]="storyOpacity()">
            
            <div class="absolute top-24 md:top-32 left-0 w-full flex justify-center">
              <h2 class="text-xl md:text-2xl lg:text-3xl font-bold tracking-tighter uppercase text-center w-11/12 max-w-2xl"
                  [class.text-white]="theme() === 'DARK'" 
                  [class.text-black]="theme() === 'LIGHT'">
                Educatie augmentata.<br>Viitorul mintii tale incepe aici.
              </h2>
            </div>
            
            <div class="absolute bottom-12 md:bottom-16 left-0 w-full flex justify-center">
              <p class="text-xs md:text-sm uppercase tracking-widest opacity-70 animate-pulse"
                 [class.text-white]="theme() === 'DARK'" 
                 [class.text-black]="theme() === 'LIGHT'">
                Da scroll pentru a explora.
              </p>
            </div>

          </div>
        } @else {
          <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style="z-index: 10; width: 80%; max-width: 800px;">
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter uppercase" 
                [class.text-white]="theme() === 'DARK'" 
                [class.text-black]="theme() === 'LIGHT'"
                [style.opacity]="storyOpacity()"
                style="transition: opacity 0.1s ease-out;">
              {{ storyText() }}
            </h2>
          </div>
        }
        
      </div>
    }
  `
})
export class LandingComponent implements OnInit, OnDestroy {
  private scrollTrigger: ScrollTrigger | null = null;
  private platformId = inject(PLATFORM_ID);

  hasEntered = UIStore.hasEntered;
  theme = AuthStore.theme; // Tragem tema direct din store
  progress = ScrollStore.progress;

  storyText = computed(() => {
    const p = this.progress();
    //if (p < 0.2) return "Uita de educatia statica. edu.ai este ecosistemul tau viu. Scroll pentru a evolua.";
    if (p < 0.4) return "Pentru tine, studentule: Fara limite. AI-ul nostru iti adapteaza cursa spre succes.";
    if (p < 0.6) return "Pentru profesori: Uitati de birocratie. Aveti super-puteri analitice si resurse infinite.";
    if (p < 0.8) return "Pentru parinti si admini: Transparenta totala. Urmareste evolutia in timp real, fara secrete.";
    return "Sincronizare 100%. Nucleul de cunoastere este online. Intra in platforma.";
  });

  storyOpacity = computed(() => {
    const p = this.progress();
    if (p >= 1) return 1; // Keep last text visible at the very end
    
    const segment = Math.floor(p / 0.2);
    const localP = (p - segment * 0.2) / 0.2; 
    if (segment === 0) {
      if (localP > 0.85) return (1 - localP) / 0.15;
      return 1; 
    }
    if (localP < 0.15) return localP / 0.15;
    if (localP > 0.85) return (1 - localP) / 0.15;
    return 1;
  });

  constructor() {
    effect(() => {
      if (this.hasEntered() && isPlatformBrowser(this.platformId)) {
        // Wait a tick for the DOM to render the scroll container
        setTimeout(() => this.initScrollTrigger(), 0);
      }
    });
  }

  ngOnInit() {
    ScrollStore.setProgress(0);
    UIStore.show3DCanvas.set(true);
  }

  initScrollTrigger() {
    if (this.scrollTrigger) return;
    
    gsap.registerPlugin(ScrollTrigger);
    this.scrollTrigger = ScrollTrigger.create({
      trigger: '.landing-scroll-container',
      scroller: '#main-scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0,
      onUpdate: (self) => {
        ScrollStore.setProgress(self.progress);
      }
    });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.scrollTrigger) {
        this.scrollTrigger.kill();
      }
      ScrollTrigger.killAll();
    }
    UIStore.show3DCanvas.set(false);
  }
}