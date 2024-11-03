import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface CustomVector3 extends THREE.Vector3 {
  color?: number;
  theta?: number;
  phi?: number;
  scaleX?: number;
  tl?: gsap.core.Timeline;
}

interface GalaxyAnimationProps {
  isTransitioning?: boolean;
}

const GalaxyAnimation: React.FC<GalaxyAnimationProps> = ({ isTransitioning = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const segmentsMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Colors setup with increased brightness
    const colors = [
      new THREE.Color(0xffd700), // Light golden yellow
      new THREE.Color(0xffffff)  // Brighter white
    ];

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);
    rendererRef.current = renderer;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 6;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, 0, 350);
    cameraRef.current = camera;

    // Galaxy group
    const galaxy = new THREE.Group();
    scene.add(galaxy);

    // Dot texture loading
    const loader = new THREE.TextureLoader();
    const dotTexture = loader.load("/img/dotTexture.png");

    // Enhanced shader material
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: dotTexture },
        uAlpha: { value: 1.0 }  // Add uniform for opacity control
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z); // Increased size multiplier
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        uniform float uAlpha;
        varying vec3 vColor;

        void main() {
          vec4 textureColor = texture2D(pointTexture, gl_PointCoord);
          if (textureColor.a < 0.3) discard;
          gl_FragColor = vec4(vColor, uAlpha) * textureColor;
          
          // Add bloom effect
          float brightness = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
          if (brightness > 0.7) {
            gl_FragColor.rgb *= 1.2;
          }
        }
      `,
      transparent: true,
      depthWrite: false
    });
    materialRef.current = shaderMaterial;

    // Dots setup with increased amount
    const dotsAmount = 3000; // 
    const dotsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(dotsAmount * 3);
    const sizes = new Float32Array(dotsAmount);
    const colorsAttribute = new Float32Array(dotsAmount * 3);
    const dots: CustomVector3[] = [];

    // Create dots with modified distribution
    for (let i = 0; i < dotsAmount; i++) {
      const vector = new THREE.Vector3() as CustomVector3;

      vector.color = Math.floor(Math.random() * colors.length);
      vector.theta = Math.random() * Math.PI * 2;
      vector.phi = (1 - Math.sqrt(Math.random())) * 
                   Math.PI / 2 * 
                   (Math.random() > 0.5 ? 1 : -1);

      vector.x = Math.cos(vector.theta!) * Math.cos(vector.phi!);
      vector.y = Math.sin(vector.phi!);
      vector.z = Math.sin(vector.theta!) * Math.cos(vector.phi!);
      vector.multiplyScalar(120 + (Math.random() - 0.5) * 5);
      vector.scaleX = 5;

      if (Math.random() > 0.5) {
        moveDot(vector, i);
      }

      dots.push(vector);
      vector.toArray(positions, i * 3);
      colors[vector.color].toArray(colorsAttribute, i * 3);
      sizes[i] = Math.random() * 4 + 4; // Varied sizes
    }

    function moveDot(vector: CustomVector3, index: number) {
      const tempVector = vector.clone() as CustomVector3;
      tempVector.multiplyScalar((Math.random() - 0.5) * 0.4 + 1);
      
      gsap.to(vector, {
        x: tempVector.x,
        y: tempVector.y,
        z: tempVector.z,
        duration: Math.random() * 3 + 3,
        yoyo: true,
        repeat: -1,
        delay: -Math.random() * 3,
        ease: "none",
        onUpdate: function () {
          positions[index * 3] = vector.x;
          positions[index * 3 + 1] = vector.y;
          positions[index * 3 + 2] = vector.z;
          dotsGeometry.attributes.position.needsUpdate = true;
        }
      });
    }

    // Buffer attributes
    dotsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dotsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    dotsGeometry.setAttribute('color', new THREE.BufferAttribute(colorsAttribute, 3));

    const wrap = new THREE.Points(dotsGeometry, shaderMaterial);
    scene.add(wrap);

    // Create white segments with enhanced brightness
    const segmentsGeom = new THREE.BufferGeometry();
    const segmentPositions: number[] = [];
    const segmentColors: number[] = [];

    for (let i = 0; i < dots.length; i++) {
      const vector = dots[i];
      for (let j = i + 1; j < dots.length; j++) {
        if (vector.distanceTo(dots[j]) < 12) {
          segmentPositions.push(vector.x, vector.y, vector.z);
          segmentPositions.push(dots[j].x, dots[j].y, dots[j].z);
          
          const color = colors[vector.color || 0];
          segmentColors.push(color.r, color.g, color.b);
          segmentColors.push(color.r, color.g, color.b);
        }
      }
    }

    segmentsGeom.setAttribute('position', 
      new THREE.Float32BufferAttribute(segmentPositions, 3));
    segmentsGeom.setAttribute('color', 
      new THREE.Float32BufferAttribute(segmentColors, 3));

    const segmentsMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    segmentsMaterialRef.current = segmentsMat;

    const segments = new THREE.LineSegments(segmentsGeom, segmentsMat);
    galaxy.add(segments);

    // Animation setup
    let hovered: number[] = [];
    let prevHovered: number[] = [];
    const mouse = new THREE.Vector2(-100, -100);

    function render() {
      raycaster.setFromCamera(mouse, camera);
      const intersections = raycaster.intersectObject(wrap);
      hovered = [];

      if (intersections.length) {
        for (let i = 0; i < intersections.length; i++) {
          const index = intersections[i].index;
          if (typeof index === 'number') {
            hovered.push(index);
            if (prevHovered.indexOf(index) === -1) {
              onDotHover(index);
            }
          }
        }
      }

      for (let i = 0; i < prevHovered.length; i++) {
        if (hovered.indexOf(prevHovered[i]) === -1) {
          mouseOut(prevHovered[i]);
        }
      }

      prevHovered = [...hovered];
      dotsGeometry.attributes.size.needsUpdate = true;
      renderer.render(scene, camera);
    }

    function onDotHover(index: number) {
      gsap.to(sizes, {
        [index]: 10,
        duration: 1,
        ease: "elastic.out(2, 0.2)",
        onUpdate: () => {
          dotsGeometry.attributes.size.needsUpdate = true;
        }
      });
    }

    function mouseOut(index: number) {
      gsap.to(sizes, {
        [index]: 3,
        duration: 0.2,
        ease: "power2.out",
        onUpdate: () => {
          dotsGeometry.attributes.size.needsUpdate = true;
        }
      });
    }

    function onMouseMove(event: MouseEvent) {
      const canvasBounds = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - canvasBounds.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - canvasBounds.top) / height) * 2 + 1;
    }

    function onResize() {
      canvas.style.width = '';
      canvas.style.height = '';
      const newWidth = canvas.offsetWidth;
      const newHeight = canvas.offsetHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    }

    // Event listeners
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(onResize, 200);
    });

    let resizeTimeout: NodeJS.Timeout;
    let animationFrameId: number;

    // Animation loop
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        render();
      }
      animate();
  
      // Cleanup
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(animationFrameId);
        scene.clear();
        renderer.dispose();
        gsap.killTweensOf(dots);
        gsap.killTweensOf(sizes);
      };
    }, []);
  
    useEffect(() => {
        if (isTransitioning && cameraRef.current) {
          const tl = gsap.timeline();
          
          // Zoom camera with enhanced effect
          tl.to(cameraRef.current.position, {
            z: -1000,
            duration: 2,
            ease: "power2.in",
            onUpdate: () => {
              if (cameraRef.current) {
                cameraRef.current.updateProjectionMatrix();
              }
            }
          });
    
        //   // Optional: Add slight rotation for more dynamic effect
        //   tl.to(cameraRef.current.rotation, {
        //     y: Math.PI * 0.5,
        //     duration: 2,
        //     ease: "power2.in",
        //   }, 0);
    
          // Maintain material opacity and enhance brightness during transition
          if (materialRef.current) {
            gsap.to(materialRef.current.uniforms.uAlpha, {
              value: 1.8, // Slightly increase brightness during transition
              duration: 2,
              ease: "power2.in"
            });
          }
    
          if (segmentsMaterialRef.current) {
            gsap.to(segmentsMaterialRef.current, {
              opacity: 0.5, // Increase line opacity during transition
              duration: 2,
              ease: "power2.in"
            });
          }
        }
      }, [isTransitioning]);
    
      return (
        <canvas 
          ref={canvasRef} 
          className="galaxy-canvas"
          style={{ 
            position: 'fixed', 
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }} 
        />
      );
    };
    
    export default GalaxyAnimation;