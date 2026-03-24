import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-white/10 p-4 text-center text-xs opacity-50 uppercase tracking-widest bg-transparent backdrop-blur-sm">
      &copy; 2026 edu.ai. All rights reserved. <a href="#" class="hover:text-[#0ABAB5] ml-4 transition-colors pointer-events-auto">Privacy</a> <a href="#" class="hover:text-[#0ABAB5] ml-4 transition-colors pointer-events-auto">Terms</a>
    </footer>
  `
})
export class FooterComponent {}
