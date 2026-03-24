import { Component } from '@angular/core';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="p-8">
      <h1 class="text-4xl font-bold tracking-tighter mb-8 uppercase">Dashboard</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="border border-white/10 p-6 bg-black/50 backdrop-blur-md">
          <h3 class="text-[#0ABAB5] text-sm uppercase tracking-widest mb-2">Role</h3>
          <p class="text-2xl">{{ role() }}</p>
        </div>
        <div class="border border-white/10 p-6 bg-black/50 backdrop-blur-md">
          <h3 class="text-[#0ABAB5] text-sm uppercase tracking-widest mb-2">Status</h3>
          <p class="text-2xl">Active</p>
        </div>
        <div class="border border-white/10 p-6 bg-black/50 backdrop-blur-md">
          <h3 class="text-[#0ABAB5] text-sm uppercase tracking-widest mb-2">System</h3>
          <p class="text-2xl">Online</p>
        </div>
      </div>
      
      <div class="mt-8 border border-white/10 p-6 bg-black/50 backdrop-blur-md h-64 flex items-center justify-center">
        <p class="opacity-50 uppercase tracking-widest text-sm">Main Content Area</p>
      </div>
    </div>
  `
})
export class DashboardComponent {
  role = AuthStore.role;
}
