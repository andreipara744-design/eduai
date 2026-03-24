import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, signal, viewChild, ElementRef } from '@angular/core';
import { extend, injectStore, NgtArgs, injectBeforeRender } from 'angular-three';
import * as THREE from 'three';
import { AuthStore } from '../../../store/auth.store';
import { ScrollStore } from '../../../store/scroll.store';
import { UIStore } from '../../../store/ui.store';
import { NgtsEnvironment } from 'angular-three-soba/staging';
import { NgtpEffectComposer, NgtpBloom } from 'angular-three-postprocessing';
import { injectGLTF } from 'angular-three-soba/loaders';
import { NgtsText } from 'angular-three-soba/abstractions';
import gsap from 'gsap';

extend(THREE);

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [NgtArgs, NgtsEnvironment, NgtpEffectComposer, NgtpBloom, NgtsText],
  template: `
    <ngt-color *args="[bgColor()]" attach="background" />
    
    <ngt-ambient-light [intensity]="ambientIntensity()" />
    <ngt-directional-light [position]="[5, 5, 5]" [intensity]="dirIntensity()" />
    <ngt-point-light [position]="[0, 0, 2]" [intensity]="bookLightIntensity()" color="#0ABAB5" />

    <ngtp-effect-composer>
      <ngtp-bloom [options]="{ mipmapBlur: true, luminanceThreshold: bloomThreshold(), intensity: bloomIntensity(), resolutionScale: 1 }" />
    </ngtp-effect-composer>

    @if (!hasEntered()) {
      <ngts-environment [options]="{ preset: 'city' }" />
      
      <ngt-group #bookGroup [position]="[0, 0, 0]" (click)="startExperience()" (pointerover)="onPointerOver()" (pointerout)="onPointerOut()">
        <ngt-mesh [position]="[-1.05, 0, 0]">
          <ngt-box-geometry *args="[0.1, 3, 0.45]" />
          <ngt-mesh-physical-material color="#0ABAB5" [roughness]="0.1" [metalness]="0.8" [clearcoat]="1" [clearcoatRoughness]="0.1" />
        </ngt-mesh>
        <ngt-mesh [position]="[0, 0, -0.2]">
          <ngt-box-geometry *args="[2, 3, 0.05]" />
          <ngt-mesh-physical-material color="#0ABAB5" [roughness]="0.1" [metalness]="0.8" [clearcoat]="1" [clearcoatRoughness]="0.1" />
        </ngt-mesh>
        <ngt-mesh [position]="[-0.05, 0, 0]">
          <ngt-box-geometry *args="[1.9, 2.9, 0.35]" />
          <ngt-mesh-standard-material color="#ffffff" [roughness]="0.9" />
        </ngt-mesh>
        <ngt-group #frontCoverGroup [position]="[-1, 0, 0.2]">
          <ngt-mesh [position]="[1, 0, 0]">
            <ngt-box-geometry *args="[2, 3, 0.05]" />
            <ngt-mesh-physical-material color="#0ABAB5" [roughness]="0.1" [metalness]="0.8" [clearcoat]="1" [clearcoatRoughness]="0.1" />
          </ngt-mesh>
        </ngt-group>
      </ngt-group>
    }

    @if (hasEntered()) {
      <ngt-group [visible]="scene1Visible()" [rotation]="[0.5, 0, 0]" [position]="[0, 1.5, 0]" #tunnelGroup>
        <ngt-points>
          <ngt-buffer-geometry [attributes]="{ position: tunnelPositions }" />
          <ngt-points-material color="#0ABAB5" [size]="spiralSize()" [sizeAttenuation]="true" [transparent]="true" [opacity]="spiralOpacity()" />
        </ngt-points>
      </ngt-group>

      <ngt-group [visible]="scene2Visible()" [scale]="hexScale()" #hexGroup>
        <ngt-mesh>
          <ngt-cylinder-geometry *args="[2, 2, 1, 6]" />
          <ngt-mesh-basic-material color="#0ABAB5" [wireframe]="true" />
        </ngt-mesh>
      </ngt-group>

      <ngt-group [visible]="scene3Visible()" #lissajousGroup>
        
        <ngt-line>
          <ngt-buffer-geometry [attributes]="{ position: lissajousPositions }" [drawRange]="{ start: 0, count: lissajousDrawCount() }" />
          <ngt-line-basic-material color="#0ABAB5" [linewidth]="3" />
        </ngt-line>

        <ngt-group [position]="[0, 0, 0]" [scale]="[0.8, 0.8, 0.8]" [rotation]="[0.5, 0, 0]">
          @if (bookGLTF(); as gltf) {
            <ngt-primitive *args="[gltf.scene]" />
            
            <ngts-text 
              text="edu.ai" 
              color="#ffffff" 
              [fontSize]="0.4" 
              [position]="[0.6, 0.2, 0.1]" 
              [rotation]="[-0.2, 0, 0]"
              outlineColor="#0ABAB5"
              [outlineWidth]="0.02">
            </ngts-text>
          }
        </ngt-group>
      </ngt-group>

      <ngt-group [visible]="scene4Visible()" #gridGroup>
        <ngt-grid-helper *args="[50, 50, '#0ABAB5', gridColor()]" [position]="[0, -2, 0]" />
      </ngt-group>

      <ngt-group [visible]="scene5Visible()" #particlesGroup>
        <ngt-points>
          <ngt-buffer-geometry [attributes]="{ position: particlePositions }" />
          <ngt-points-material color="#0ABAB5" [size]="particleSize()" [sizeAttenuation]="true" />
        </ngt-points>
      </ngt-group>
    }
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SceneComponent {
  private store = injectStore();
  
  bgColor = signal('#000000');
  ambientIntensity = signal(0.5);
  dirIntensity = signal(1);
  gridColor = signal('#222222');
  bookLightIntensity = signal(0);
  bloomThreshold = signal(0.2);
  bloomIntensity = signal(1.5);

  spiralSize = signal(0.02);
  spiralOpacity = signal(0.8);

  hasEntered = UIStore.hasEntered;

  scene1Visible = signal(false);
  scene2Visible = signal(false);
  scene3Visible = signal(false);
  scene4Visible = signal(false);
  scene5Visible = signal(false);

  hexScale = signal<[number, number, number]>([0, 0, 0]);
  lissajousDrawCount = signal(0);
  particleSize = signal(0.1);

  tunnelPositions: THREE.BufferAttribute;
  lissajousPositions: THREE.BufferAttribute;
  particlePositions: THREE.BufferAttribute;
  
  totalLissajousPoints = 1000;

  // Încărcăm modelul
  bookGLTF = injectGLTF(() => '/open_book.glb');

  bookGroup = viewChild<ElementRef<THREE.Group>>('bookGroup');
  frontCoverGroup = viewChild<ElementRef<THREE.Group>>('frontCoverGroup');
  tunnelGroup = viewChild<ElementRef<THREE.Group>>('tunnelGroup');
  hexGroup = viewChild<ElementRef<THREE.Group>>('hexGroup');
  lissajousGroup = viewChild<ElementRef<THREE.Group>>('lissajousGroup');
  gridGroup = viewChild<ElementRef<THREE.Group>>('gridGroup');
  particlesGroup = viewChild<ElementRef<THREE.Group>>('particlesGroup');

  constructor() {
    // MAGIA HOLOGRAMĂ NEON
    effect(() => {
      const gltf = this.bookGLTF();
      if (gltf) {
        gltf.scene.traverse((child: any) => {
          if (child.isMesh) {
            child.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color('#0ABAB5'),
              emissive: new THREE.Color('#0ABAB5'),
              emissiveIntensity: 0.4,
              metalness: 0.3,
              roughness: 0.1,
              transparent: true,
              opacity: 0.85
            });
          }
        });
      }
    });

    const constellationCount = 4000;
    const constellationArray = new Float32Array(constellationCount * 3);
    const arms = 4;

    for (let i = 0; i < constellationCount; i++) {
      const r = Math.pow(Math.random(), 2) * 4.5; 
      const armOffset = (i % arms) * ((Math.PI * 2) / arms);
      const theta = armOffset + r * 1.5 + (Math.random() - 0.5) * 0.4;
      const y = (Math.random() - 0.5) * (1.2 * Math.exp(-r * 0.5));
      
      constellationArray[i * 3] = r * Math.cos(theta);
      constellationArray[i * 3 + 1] = y;
      constellationArray[i * 3 + 2] = r * Math.sin(theta);
    }
    this.tunnelPositions = new THREE.BufferAttribute(constellationArray, 3);

    const lissajousArray = new Float32Array(this.totalLissajousPoints * 3);
    for (let i = 0; i < this.totalLissajousPoints; i++) {
      const t = (i / this.totalLissajousPoints) * Math.PI * 2;
      const x = 3 * Math.sin(1 * t + Math.PI / 2);
      const y = 3 * Math.sin(2 * t);
      const z = Math.sin(3 * t);
      lissajousArray[i * 3] = x;
      lissajousArray[i * 3 + 1] = y;
      lissajousArray[i * 3 + 2] = z;
    }
    this.lissajousPositions = new THREE.BufferAttribute(lissajousArray, 3);

    const particleCount = 2000;
    const particleArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 3 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      particleArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particleArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particleArray[i * 3 + 2] = r * Math.cos(phi);
    }
    this.particlePositions = new THREE.BufferAttribute(particleArray, 3);

    effect(() => {
      const theme = AuthStore.theme();
      
      if (theme === 'LIGHT' && this.hasEntered()) {
        this.bgColor.set('#FFFFFF');
        this.ambientIntensity.set(1.0);
        this.dirIntensity.set(1.5);
        this.bloomThreshold.set(1.0); 
        this.bloomIntensity.set(0.0);
        
        this.spiralSize.set(0.05);
        this.spiralOpacity.set(1.0);
      } else {
        this.bgColor.set('#000000');
        this.ambientIntensity.set(0.5);
        this.dirIntensity.set(1);
        this.bloomThreshold.set(0.2);
        this.bloomIntensity.set(1.5);
        
        this.spiralSize.set(0.02);
        this.spiralOpacity.set(0.8);
      }
    });

    effect(() => {
      if (!this.hasEntered()) {
        const camera = this.store.snapshot.camera;
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);
        return;
      }

      const progress = ScrollStore.progress();
      const camera = this.store.snapshot.camera;
      
      this.scene1Visible.set(progress >= 0 && progress < 0.2);
      if (this.scene1Visible()) {
        const localP = progress / 0.2;
        camera.position.z = -localP * 50 + 5;
        camera.position.x = Math.sin(localP * Math.PI * 4) * 0.5;
        camera.position.y = Math.cos(localP * Math.PI * 4) * 0.5;
        camera.lookAt(0, 0, -localP * 50 - 10);
      }

      this.scene2Visible.set(progress >= 0.2 && progress < 0.4);
      if (this.scene2Visible()) {
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);
        const localP = (progress - 0.2) / 0.2;
        this.hexScale.set([localP, localP, localP]);
      }

      this.scene3Visible.set(progress >= 0.4 && progress < 0.6);
      if (this.scene3Visible()) {
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);
        const localP = (progress - 0.4) / 0.2;
        this.lissajousDrawCount.set(Math.floor(localP * this.totalLissajousPoints));
      }

      this.scene4Visible.set(progress >= 0.6 && progress < 0.8);
      if (this.scene4Visible()) {
        const localP = (progress - 0.6) / 0.2;
        camera.position.set(Math.sin(localP * Math.PI) * 10, 5, Math.cos(localP * Math.PI) * 10);
        camera.lookAt(0, 0, 0);
      }

      this.scene5Visible.set(progress >= 0.8 && progress <= 1.0);
      if (this.scene5Visible()) {
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);
        const localP = (progress - 0.8) / 0.2;
        this.particleSize.set(0.05 + Math.sin(localP * Math.PI * 4) * 0.05);
      }
    });

    let lastProgress = 0;

    injectBeforeRender(({ clock }) => {
      const time = clock.elapsedTime;
      
      const progress = ScrollStore.progress();
      const deltaScroll = Math.abs(progress - lastProgress);
      lastProgress = progress;
      
      const book = this.bookGroup()?.nativeElement;
      if (book && !this.hasEntered()) {
        book.rotation.y = Math.sin(time * 0.5) * 0.1;
        book.position.y = Math.sin(time * 2) * 0.2;
      }

      const tunnel = this.tunnelGroup()?.nativeElement;
      if (tunnel && this.scene1Visible()) {
        const baseSpeed = 0.001; 
        const scrollBoost = deltaScroll * 5; 
        tunnel.rotation.y += baseSpeed + scrollBoost;
        tunnel.position.y = Math.sin(time) * 0.5; 
      }

      const hex = this.hexGroup()?.nativeElement;
      if (hex && this.scene2Visible()) {
        hex.rotation.y += 0.005;
        hex.rotation.x += 0.002;
        hex.position.y = Math.sin(time * 2) * 0.1;
      }
      
      const lissajous = this.lissajousGroup()?.nativeElement;
      if (lissajous && this.scene3Visible()) {
        lissajous.rotation.y += 0.005;
        lissajous.position.y = Math.sin(time * 2) * 0.1;
      }

      const grid = this.gridGroup()?.nativeElement;
      if (grid && this.scene4Visible()) {
        grid.position.y = -2 + Math.sin(time * 2) * 0.1;
      }

      const particles = this.particlesGroup()?.nativeElement;
      if (particles && this.scene5Visible()) {
        particles.rotation.y += 0.002;
        particles.position.y = Math.sin(time * 1.5) * 0.1;
      }
    });
  }

  onPointerOver() {
    document.body.style.cursor = 'pointer';
  }

  onPointerOut() {
    document.body.style.cursor = 'default';
  }

  startExperience() {
    if (this.hasEntered()) return;

    const frontCover = this.frontCoverGroup()?.nativeElement;
    const book = this.bookGroup()?.nativeElement;

    if (frontCover && book) {
      document.body.style.cursor = 'default';
      
      gsap.to(frontCover.rotation, {
        y: -Math.PI * 0.8,
        duration: 1.5,
        ease: 'power3.inOut'
      });

      const proxy = { intensity: this.bookLightIntensity() };
      gsap.to(proxy, {
        intensity: 5,
        duration: 1.5,
        onUpdate: () => {
          this.bookLightIntensity.set(proxy.intensity);
        }
      });

      gsap.to(book.position, {
        z: 5,
        x: 1,
        duration: 1.5,
        ease: 'power2.in',
        onComplete: () => {
          UIStore.hasEntered.set(true);
        }
      });
    } else {
      UIStore.hasEntered.set(true);
    }
  }
}