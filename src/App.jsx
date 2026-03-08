import React, { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Float, Text, ContactShadows, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, Shield, Code, Database, Globe, BrainCircuit } from "lucide-react";

// --- Custom Shader for the 3D Image ---
const Image3DShader = {
    uniforms: {
        uTexture: { value: null },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uDistortion: { value: 0.1 },
    },
    vertexShader: `
    varying vec2 vUv;
    uniform vec2 uMouse;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Add wave movement
      float wave = sin(uv.x * 10.0 + uTime) * 0.1;
      pos.z += wave;

      // Mouse-based depth effect
      float dist = distance(uv, uMouse);
      pos.z += sin(dist * 3.14159) * 0.3; 
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uTime;
    void main() {
      vec4 color = texture2D(uTexture, vUv);
      // Subtle aberration or scanline effect could go here
      gl_FragColor = color;
    }
  `
};

const Experience3D = ({ imagePath }) => {
    const meshRef = useRef();
    const texture = useLoader(THREE.TextureLoader, imagePath);

    const shaderData = useMemo(() => ({
        ...Image3DShader,
        uniforms: {
            ...Image3DShader.uniforms,
            uTexture: { value: texture },
            uMouse: { value: new THREE.Vector2(0, 0) }
        }
    }), [texture]);

    useFrame((state) => {
        const { x, y } = state.mouse;
        const time = state.clock.getElapsedTime();

        // Smooth lerp for rotation
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.2, 0.05);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -y * 0.2, 0.05);

        // Update uniforms
        meshRef.current.material.uniforms.uMouse.value.set(x * 0.5 + 0.5, y * 0.5 + 0.5);
        meshRef.current.material.uniforms.uTime.value = time;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef}>
                <planeGeometry args={[3.2, 4.5, 64, 64]} />
                <shaderMaterial
                    args={[shaderData]}
                    side={THREE.DoubleSide}
                    transparent={true}
                />
            </mesh>
        </Float>
    );
};

// --- Navbar Component ---
const Navbar = () => (
    <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-transparent">
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black tracking-tighter"
        >
            YOUSEF<span className="text-blue-500">.</span>AIE
        </motion.div>
        <div className="flex gap-8 text-xs uppercase tracking-[0.2em] font-medium opacity-70">
            <a href="#about" className="hover:text-blue-500 transition-colors">About</a>
            <a href="#projects" className="hover:text-blue-500 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-blue-500 transition-colors">Connect</a>
        </div>
    </nav>
);

// --- Hero UI Component ---
const HeroUI = () => (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-10 z-10">
        <div className="max-w-2xl">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-8xl font-black leading-[0.8] mb-4"
            >
                YOUSEF <br /> <span className="text-transparent border-t border-white/20 pt-4 px-2" style={{ WebkitTextStroke: "1px white" }}>OSAMA</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-sm tracking-[0.3em] uppercase text-blue-500 font-mono"
            >
                Artificial Intelligence Engineer | 2nd Year Student
            </motion.p>
        </div>

        <div className="flex justify-between items-end">
            <div className="space-y-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="w-12 h-12 rounded-full glass flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-blue-500/20 transition-all border border-white/10"
                >
                    <Github size={20} />
                </motion.div>
                <div className="w-px h-24 bg-gradient-to-t from-blue-500 to-transparent mx-auto opacity-30"></div>
            </div>

            <div className="text-right glass p-6 border-white/5 space-y-2 max-w-[200px] pointer-events-auto">
                <h3 className="text-[10px] tracking-[0.2em] uppercase opacity-50">Stack Focus</h3>
                <div className="flex flex-wrap gap-2 justify-end">
                    <Globe size={14} className="text-blue-400" />
                    <Shield size={14} className="text-purple-400" />
                    <Database size={14} className="text-rose-400" />
                    <BrainCircuit size={14} className="text-emerald-400" />
                </div>
                <p className="text-[9px] leading-tight font-mono opacity-40">GPU-ACCELERATED MESH RENDERING ENGINE v2.0</p>
            </div>
        </div>
    </div>
);

export default function App() {
    return (
        <div className="relative h-screen w-full bg-[#050505] text-white overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>

            <Navbar />
            <HeroUI />

            {/* Main 3D Canvas */}
            <Canvas
                camera={{ position: [0, 0, 7], fov: 40 }}
                dpr={[1, 2]}
                className="z-0"
            >
                <color attach="background" args={['#050505']} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

                <Suspense fallback={null}>
                    <Experience3D imagePath="/me.jpeg" />
                    <ContactShadows opacity={0.4} scale={10} blur={2.4} far={4.5} />
                    <Environment preset="city" />
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                />
            </Canvas>

            {/* Interactive Grain Effect */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] contrast-150 brightness-150" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>
        </div>
    );
}
