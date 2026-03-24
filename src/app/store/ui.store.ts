import { signal } from '@angular/core';

export const UIStore = {
  show3DCanvas: signal<boolean>(true),
  hasEntered: signal<boolean>(false)
};
