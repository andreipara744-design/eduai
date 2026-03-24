import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgtCanvas } from 'angular-three/dom';
import { SceneComponent } from './scene/scene.component';

@Component({
  selector: 'app-canvas-3d',
  standalone: true,
  imports: [NgtCanvas, SceneComponent],
  template: `
    <div class="fixed top-0 left-0 w-full h-full" style="z-index: 0;">
      <ngt-canvas>
        <ng-template canvasContent>
          <app-scene />
        </ng-template>
      </ngt-canvas>
    </div>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Canvas3DComponent {
}
