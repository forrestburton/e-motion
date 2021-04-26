import { TweenMax as TM } from 'gsap';
import * as THREE from 'three';

export default class Figure {
  private _image: any;
  private scene: THREE.Scene;
  private loader: THREE.TextureLoader;
  private image: THREE.Texture;
  private hoverImage: THREE.Texture;

  private size: THREE.Vector2;
  private offset: THREE.Vector2;
  private material?: THREE.MeshBasicMaterial;
  private geometry?: THREE.PlaneGeometry;
  public mesh?: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  public mouse: THREE.Vector2;

  constructor(scene: THREE.Scene) {
    this._image = document.querySelector('.tile-image');
    this.scene = scene;

    this.loader = new THREE.TextureLoader();

    this.image = this.loader.load(this._image.src);
    this.hoverImage = this.loader.load(this._image.dataset.hover);

    this._image.style.opacity = 0;

    this.size = new THREE.Vector2(0, 0);
    this.offset = new THREE.Vector2(0, 0);

    this.getSizes();
    this.createMesh();

    this.mouse = new THREE.Vector2(0, 0);
    window.addEventListener('mousemove', ev => {
      this.mouseMove(ev);
    });
  }

  public getSizes(): void {
    const {width, height, top, left} = this._image.getBoundingClientRect();
    this.size.set(width, height);
    this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);
  }

  public createMesh(): void {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ map: this.image });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.mesh.scale.set(this.size.x, this.size.y, 1);

    this.scene.add(this.mesh);
  }

  public mouseMove(ev): void {
    TM.to(this.mouse, 0.5, {
      x: (ev.clientX / window.innerWidth) * 2 - 1,
      y: -(ev.clientY / window.innerHeight) * 2 + 1,
    });

    TM.to(this.mesh?.rotation, 0.5, {
      x: -this.mouse.y * .3,
      y: this.mouse.x * (Math.PI / 6),
    });
  }
}