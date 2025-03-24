import * as THREE from "three-gl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Events } from "../events";

import store from "../store";

import FBO from "./FBO";

import simVertex from "./shaders/simulation.vert";
import simFragment from "./shaders/simulation.frag";
import particlesVertex from "./shaders/particles.vert";
import particlesFragment from "./shaders/particles.frag";
import fullScreenVertex from "./shaders/fullscreen.vert";
import fullScreenFragment from "./shaders/fullscreen.frag";

import { getRandomSpherePoint } from "../utils";

// import GUI from "../gui";

export default new (class {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "default",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(store.bounds.ww, store.bounds.wh);
    this.renderer.setClearColor(
      new THREE.Color(16 / 255, 16 / 255, 16 / 255),
      1
    );

    this.camera = new THREE.PerspectiveCamera(
      45,
      store.bounds.ww / store.bounds.wh,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 4);

    this.scene = new THREE.Scene();

    this.canvas = null;

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enableDamping = true;
    // this.controls.minDistance = 0.1;
    // this.controls.maxDistance = 100;
    // this.controls.enablePan = true;
    // this.controls.enableRotate = true;
    // this.controls.dampingFactor = 0.05;
    // this.controls.rotateSpeed = 1.0;
    // this.controls.zoomSpeed = 1.0;
    // this.controls.panSpeed = 1.0;

    this.clock = new THREE.Clock();
    this.time = null;

    this.mouse = new THREE.Vector2(0, 0);
    this.mouseTarget = new THREE.Vector2(0, 0);

    this.zoomDisplay = document.createElement("div");
    this.zoomDisplay.style.position = "fixed";
    this.zoomDisplay.style.top = "10px";
    this.zoomDisplay.style.left = "10px";
    this.zoomDisplay.style.color = "white";
    this.zoomDisplay.style.fontFamily = "monospace";
    // document.body.appendChild(this.zoomDisplay);

    this.mouseDisplay = document.createElement("div");
    this.mouseDisplay.style.position = "fixed";
    this.mouseDisplay.style.top = "40px";
    this.mouseDisplay.style.left = "10px";
    this.mouseDisplay.style.color = "white";
    this.mouseDisplay.style.fontFamily = "monospace";
    this.mouseDisplay.style.backgroundColor = "rgba(0,0,0,0.5)";
    this.mouseDisplay.style.padding = "5px 10px";
    this.mouseDisplay.style.borderRadius = "3px";
    // document.body.appendChild(this.mouseDisplay);

    // Configuration du zoom
    this.zoomConfig = {
      min: 0,
      max: 50,
      current: 4,
      smooth: 0.1,
    };

    // Initialiser la caméra avec le zoom de départ
    this.camera.position.z = this.zoomConfig.current;

    this.rotationTorus = 0;

    // Écouter le scroll
    this.setupScroll();

    // Ajouter les axes
    const axesHelper = new THREE.AxesHelper(5); // Le paramètre définit la longueur des axes
    axesHelper.material.linewidth = 2; // Épaisseur des lignes (ne fonctionne pas sur tous les navigateurs)

    // Personnaliser les couleurs si besoin
    const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Rouge pour X
    const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Vert pour Y
    const zAxisMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Bleu pour Z

    axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff);

    // this.scene.add(axesHelper);

    // Optionnel : Ajouter des labels pour les axes
    const createAxisLabel = (text, position, color) => {
      const div = document.createElement("div");
      div.className = "axis-label";
      div.textContent = text;
      div.style.position = "absolute";
      div.style.color = color;
      div.style.backgroundColor = "rgba(0,0,0,0.5)";
      div.style.padding = "2px 5px";
      div.style.borderRadius = "3px";
      div.style.fontSize = "12px";
      div.style.fontFamily = "monospace";
      // document.body.appendChild(div);
      return div;
    };

    this.axisLabels = {
      x: createAxisLabel("X", [0, 0], "#ff0000"),
      y: createAxisLabel("Y", [0, 0], "#00ff00"),
      z: createAxisLabel("Z", [0, 0], "#0000ff"),
    };

    // this.simMaterial.uniforms.uOscillation = { value: 0 };

    // Ajouter une valeur cible pour le smoothing
    this.oscillationTarget = 0.5;
    this.currentOscillation = 0.5;

    // Détecter le type d'appareil
    this.isMobile = window.matchMedia("(max-width: 768px)").matches;
    console.log("Is mobile:", this.isMobile);
    // Écouter les changements de taille d'écran
    window.matchMedia("(max-width: 768px)").addEventListener("change", (e) => {
      this.isMobile = e.matches;
      console.log("Is mobile:", this.isMobile);
    });

    // Ajuster les paramètres selon l'appareil
    // if (this.isMobile) {
    //     // Configuration pour mobile
    //     this.camera.position.z = 20;  // Plus loin sur mobile
    //     this.controls.enableZoom = false;  // Désactiver le zoom sur mobile
    // } else {
    //     // Configuration pour desktop
    //     this.camera.position.z = 15;  // Plus proche sur desktop
    //     this.controls.enableZoom = true;
    // }

    this.init();
  }

  init() {
    this.addCanvas();
    this.addEvents();
    this.setGui();
    this.createFBO();
    this.createScreenQuad();
  }

  addCanvas() {
    this.canvas = this.renderer.domElement;
    this.canvas.classList.add("webgl");
    document.body.appendChild(this.canvas);
  }

  addEvents() {
    Events.on("tick", this.render.bind(this));
    Events.on("resize", this.resize.bind(this));

    window.addEventListener("mousemove", (e) => {
      this.mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  setGui() {
    this.tweaks = {
      pointSize: 2,
      speed: 0.3,
      curlFreq: 0.25,
      opacity: 1.0,
      numBranches: 3,
      branchDepth: 0.6,
      sharpness: 100.0,
      slideSpeedX: 0,
      slideSpeedY: 0,
      zoom: 0,
    };
  }

  createFBO() {
    // width and height of FBO
    const width = 64;
    const height = 64;

    // Populate a Float32Array of random positions
    let length = width * height * 3;
    let data = new Float32Array(length);
    for (let i = 0; i < length; i += 3) {
      // Random positions inside a sphere
      const point = getRandomSpherePoint();
      data[i + 0] = point.x;
      data[i + 1] = point.y;
      data[i + 2] = point.z;

      // // Replaced with this if you want
      // // random positions inside a cube
      // data[i + 0] = Math.random() - 0.5;
      // data[i + 1] = Math.random() - 0.5;
      // data[i + 2] = Math.random() - 0.5;
    }

    // Convert the data to a FloatTexture
    const positions = new THREE.DataTexture(
      data,
      width,
      height,
      THREE.RGBFormat,
      THREE.FloatType
    );
    positions.needsUpdate = true;

    // Simulation shader material used to update the particles' positions
    this.simMaterial = new THREE.ShaderMaterial({
      vertexShader: simVertex,
      fragmentShader: simFragment,
      uniforms: {
        positions: { value: positions },
        uTime: { value: 0 },
        uSpeed: { value: this.tweaks.speed },
        uCurlFreq: { value: this.tweaks.curlFreq },
        uMouse: { value: this.mouse },
        uNumBranches: { value: this.tweaks.numBranches },
        uBranchDepth: { value: this.tweaks.branchDepth },
        uSharpness: { value: 2.0 },
        uSlideSpeedX: { value: this.tweaks.slideSpeedX },
        uSlideSpeedY: { value: this.tweaks.slideSpeedY },
        uRotationTorus: { value: this.rotationTorus },
        uOscillation: { value: 0.5 },
      },
    });

    // Render shader material to display the particles on screen
    // the positions uniform will be set after the this.fbo.update() call
    this.renderMaterial = new THREE.ShaderMaterial({
      vertexShader: particlesVertex,
      fragmentShader: particlesFragment,
      uniforms: {
        positions: { value: null },
        uTime: { value: 0 },
        uPointSize: { value: this.tweaks.pointSize },
        uOpacity: { value: this.tweaks.opacity },
        uMouse: { value: this.mouse },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    // Initialize the FBO
    this.fbo = new FBO(
      width,
      height,
      this.renderer,
      this.simMaterial,
      this.renderMaterial
    );
    // Add the particles to the scene
    this.scene.add(this.fbo.particles);
  }

  createScreenQuad() {
    const geometry = new THREE.PlaneGeometry(4, 4);
    const material = new THREE.ShaderMaterial({
      vertexShader: fullScreenVertex,
      fragmentShader: fullScreenFragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(store.bounds.ww, store.bounds.wh),
        },
        uMouse: { value: this.mouse },
      },
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    this.fullScreenQuad = new THREE.Mesh(geometry, material);
    // this.scene.add(this.fullScreenQuad);
  }

  resize() {
    let width = store.bounds.ww;
    let height = store.bounds.wh;

    this.camera.aspect = width / height;
    this.renderer.setSize(width, height);

    this.camera.updateProjectionMatrix();

    this.fullScreenQuad.material.uniforms.uResolution.value.x = store.bounds.ww;
    this.fullScreenQuad.material.uniforms.uResolution.value.y = store.bounds.wh;
  }

  setupScroll() {
    // Calculer la hauteur totale scrollable
    const totalScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    window.addEventListener("scroll", () => {
      // Convertir le scroll en valeur de zoom
      const scrollRatio = window.pageYOffset / window.innerHeight;
      console.log(scrollRatio);

      if (!this.isMobile) {
        if (scrollRatio > 2 && scrollRatio <= 5) {
          // Calculer la valeur cible
          this.oscillationTarget = THREE.MathUtils.mapLinear(
            scrollRatio,
            2,
            5,
            0.5,
            0.9
          );

          // Appliquer le smoothing
        } else if (scrollRatio < 3) {
        } else if (scrollRatio > 6 && scrollRatio < 7) {
          this.oscillationTarget = THREE.MathUtils.mapLinear(
            scrollRatio,
            6,
            7,
            0.9,
            0.1
          );

          // Appliquer le smoothing
          // this.currentOscillation +=
          // (this.oscillationTarget - this.currentOscillation) * 0.1; // 0.1 est la vitesse de smoothing

          // Mettre à jour l'uniform
          // this.simMaterial.uniforms.uOscillation.value = this.currentOscillation;
        }
      }
    });
  }

  render() {
    // this.controls.update();

    this.time = this.clock.getElapsedTime();

    if (Math.abs(this.oscillationTarget - this.currentOscillation) > 0.01) {
      this.currentOscillation +=
        (this.oscillationTarget - this.currentOscillation) * 0.1; // 0.1 est la vitesse de smoothing
      console.log(this.currentOscillation);
      // Mettre à jour l'uniform
      this.simMaterial.uniforms.uOscillation.value = this.currentOscillation;
    }

    this.fbo.update(this.time);

    this.fullScreenQuad.material.uniforms.uTime.value = this.time;

    this.mouse.lerp(this.mouseTarget, 0.1);
    this.simMaterial.uniforms.uMouse.value = this.mouse;

    this.tweaks.zoom = this.camera.position.z;

    const zoom = this.camera.position.z.toFixed(2);
    this.zoomDisplay.textContent = `Zoom: ${zoom}`;

    const mouseX = this.mouse.x.toFixed(3);
    const mouseY = this.mouse.y.toFixed(3);
    this.mouseDisplay.textContent = `Mouse: (${mouseX}, ${mouseY})`;

    // Mettre à jour la position des labels des axes
    if (this.axisLabels) {
      const updateAxisLabel = (label, position) => {
        const vector = position.clone();
        vector.project(this.camera);

        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;

        label.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
      };

      updateAxisLabel(this.axisLabels.x, new THREE.Vector3(6, 0, 0));
      updateAxisLabel(this.axisLabels.y, new THREE.Vector3(0, 6, 0));
      updateAxisLabel(this.axisLabels.z, new THREE.Vector3(0, 0, 6));
    }

    // Créer une oscillation entre 0 et 1 basée sur le temps
    // const oscillation = (Math.sin(this.time * 0.5) + 1) * 0.5;  // transforme -1,1 en 0,1
    // this.simMaterial.uniforms.uOscillation.value = oscillation;

    this.renderer.render(this.scene, this.camera);
  }
})();
