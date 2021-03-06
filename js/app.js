import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import FontFaceObserver from 'fontfaceobserver'
import imagesLoaded from 'imagesloaded'
import gsap from 'gsap'
import Scroll from './scroll'
import fragment from './shader/fragment.glsl'
import vertex from './shader/vertex.glsl'

import ocean from '../img/ocean.jpg'

export default class Sketch {
  constructor(options) {
    this.time = 0
    this.container = options.dom
    this.scene = new THREE.Scene()

    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 100, 2000)
    // not 600
    this.camera.position.z = 660
    this.camera.fov = 2 * Math.atan(this.height / 2 / 660) * (180 / Math.PI)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(this.width, this.height)
    this.container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.images = [...document.querySelectorAll('img')]

    this.currentScroll = 0

    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    const fontOpen = new Promise((resolve) => {
      new FontFaceObserver('Open Sans').load().then(() => {
        resolve()
      })
    })

    const fontPlayfair = new Promise((resolve) => {
      new FontFaceObserver('Playfair Display').load().then(() => {
        resolve()
      })
    })

    const preloadImages = new Promise((resolve) => {
      imagesLoaded(document.querySelectorAll('img'), { background: true }, resolve)
    })

    Promise.all([fontOpen, fontPlayfair, preloadImages]).then(() => {
      this.scroll = new Scroll()
      this.addImages()
      this.setPosition()

      this.mouseMovement()
      this.setupResize()
      this.render()

      window.addEventListener('scroll', () => {
        this.currentScroll = window.scrollY
      })
    })
  }

  mouseMovement() {
    window.addEventListener(
      'mousemove',
      (event) => {
        this.mouse.x = (event.clientX / this.width) * 2 - 1
        this.mouse.y = (event.clientY / this.height) * 2 - 1

        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera)
        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.scene.children)

        if (intersects.length) {
          let obj = intersects[0].object
          obj.material.uniforms.hover.value = intersects[0].uv
        }
      },
      false,
    )
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addImages() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        uImage: { value: 0 },
        hoverState: { value: 0 },
        hover: { value: new THREE.Vector2(0.5, 0.5) },
      },
      side: THREE.DoubleSide,
      fragmentShader: fragment,
      vertexShader: vertex,
      // wireframe: true,
    })

    this.materials = []

    this.imageStore = this.images.map((img) => {
      let bounds = img.getBoundingClientRect()
      let geomentry = new THREE.PlaneBufferGeometry(bounds.width, bounds.height, 10, 10)
      let texture = new THREE.Texture(img)
      texture.needsUpdate = true

      let material = this.material.clone()

      img.addEventListener('mouseenter', () => {
        gsap.to(material.uniforms.hoverState, {
          duration: 1,
          value: 1,
        })
      })
      img.addEventListener('mouseout', () => {
        gsap.to(material.uniforms.hoverState, {
          duration: 1,
          value: 0,
        })
      })

      this.materials.push(material)
      material.uniforms.uImage.value = texture

      let mesh = new THREE.Mesh(geomentry, material)

      this.scene.add(mesh)

      return {
        img,
        mesh,
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
      }
    })
  }

  setPosition() {
    this.imageStore.forEach((o) => {
      o.mesh.position.x = o.left - this.width / 2 + o.width / 2
      o.mesh.position.y = this.currentScroll + -o.top + this.height / 2 - o.height / 2
    })
  }

  render() {
    this.time += 0.05
    this.scroll.render()
    this.currentScroll = this.scroll.scrollToRender
    this.setPosition()

    this.materials.forEach((m) => {
      m.uniforms.time.value = this.time
    })

    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(this.render.bind(this))
  }
}

new Sketch({ dom: document.getElementById('container') })
