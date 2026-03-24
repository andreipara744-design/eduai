import { signal } from '@angular/core';

export const ScrollStore = {
  progress: signal<number>(0),
  setProgress: (p: number) => ScrollStore.progress.set(p)
};
