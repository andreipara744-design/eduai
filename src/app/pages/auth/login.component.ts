import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore, Role } from '../../store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="flex items-center justify-center h-full min-h-[80vh]">
      <div class="border border-white/10 p-8 bg-black/80 backdrop-blur-xl w-full max-w-md rounded-3xl">
        <h2 class="text-3xl font-bold tracking-tighter mb-6 uppercase text-center text-[#0ABAB5]">System Access</h2>
        
        <div class="flex flex-col gap-4">
          <button (click)="loginAs('STUDENT')" class="w-full py-3 rounded-full border border-white/20 hover:border-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-black transition-all uppercase tracking-widest text-sm">Login as Student</button>
          <button (click)="loginAs('TEACHER')" class="w-full py-3 rounded-full border border-white/20 hover:border-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-black transition-all uppercase tracking-widest text-sm">Login as Teacher</button>
          <button (click)="loginAs('PARENT')" class="w-full py-3 rounded-full border border-white/20 hover:border-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-black transition-all uppercase tracking-widest text-sm">Login as Parent</button>
          <button (click)="loginAs('ADMIN')" class="w-full py-3 rounded-full border border-white/20 hover:border-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-black transition-all uppercase tracking-widest text-sm">Login as Admin</button>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private router = inject(Router);

  loginAs(role: Role) {
    AuthStore.login({
      id: '1',
      name: 'Test User',
      avatar: '',
      role: role
    });
    this.router.navigate(['/dashboard']);
  }
}