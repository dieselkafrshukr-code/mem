import React, { useRef, useMemo, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Float, ContactShadows, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Instagram, Facebook, Phone, MessageSquare, Shield, Code, Database, Globe, BrainCircuit, Music, Volume2, VolumeX, User, Rocket, Mail, MapPin, GraduationCap, Briefcase, Video } from "lucide-react";

// --- Custom Shader for the 3D Image ---
const Image3DShader = {
    uniforms: {
        uTexture: { value: null },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
    },
    vertexShader: `
    varying vec2 vUv;
    uniform vec2 uMouse;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 pos = position;
      float dist = distance(uv, uMouse);
      pos.z += sin(dist * 5.0 - uTime * 2.0) * 0.15; 
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    void main() {
      vec4 color = texture2D(uTexture, vUv);
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
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.3, 0.05);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -y * 0.3, 0.05);
        meshRef.current.material.uniforms.uMouse.value.set(x * 0.5 + 0.5, y * 0.5 + 0.5);
        meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh ref={meshRef}>
                <planeGeometry args={[3.5, 4.5, 64, 64]} />
                <shaderMaterial args={[shaderData]} side={THREE.DoubleSide} transparent />
            </mesh>
        </Float>
    );
};

const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio('./bg-music.mp3');
        audioRef.current.loop = true;

        // Auto-play attempt (often blocked by browsers until interaction)
        const playAudio = () => {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
            window.removeEventListener('click', playAudio);
        };
        window.addEventListener('click', playAudio);

        return () => {
            audioRef.current.pause();
            window.removeEventListener('click', playAudio);
        };
    }, []);

    const toggle = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed bottom-10 left-10 z-[60] flex items-center gap-4">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggle}
                className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white"
            >
                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </motion.button>
            {isPlaying && (
                <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [4, 16, 4] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                            className="w-1 bg-blue-500 rounded-full"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const AboutSection = () => (
    <section id="about" className="min-h-screen py-32 px-10 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-12"
            >
                <div className="space-y-6">
                    <h2 className="text-5xl font-black tracking-tighter flex items-center gap-4">
                        <User className="text-blue-500" /> PERSONAL INFO
                    </h2>
                    <div className="grid grid-cols-1 gap-6 text-lg opacity-80">
                        <div className="flex items-center gap-4 glass p-4 rounded-xl border-white/5">
                            <Rocket className="text-blue-400" /> <span><b>Name:</b> Yousef Osama</span>
                        </div>
                        <div className="flex items-center gap-4 glass p-4 rounded-xl border-white/5">
                            <MapPin className="text-rose-400" /> <span><b>From:</b> Banha, Egypt</span>
                        </div>
                        <div className="flex items-center gap-4 glass p-4 rounded-xl border-white/5">
                            <GraduationCap className="text-purple-400" />
                            <span>
                                <b>Education:</b> AI Engineering (AIE) Student at Galala University (2nd Year).
                                <br />
                                <small className="opacity-60">Computer Engineer specialized in AI.</small>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-5xl font-black tracking-tighter flex items-center gap-4">
                        <Code className="text-emerald-500" /> TECH STACK & INTERESTS
                    </h2>
                    <div className="flex flex-wrap gap-4 font-mono text-sm">
                        {['Web Development', 'Cybersecurity', 'Databases', 'AI / Machine Learning'].map(tag => (
                            <span key={tag} className="px-4 py-2 glass rounded-full border-blue-500/20 text-blue-300">#{tag}</span>
                        ))}
                    </div>
                    <p className="opacity-70 leading-relaxed">
                        I am a Computer Engineer specializing in Artificial Intelligence with a deep passion for Web Development.
                        I focus on creating secure, high-performance web applications backed by robust database architectures.
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-12"
            >
                <div className="space-y-6">
                    <h2 className="text-5xl font-black tracking-tighter flex items-center gap-4">
                        <Briefcase className="text-amber-500" /> EXPERIENCE & SKILLS
                    </h2>
                    <div className="space-y-4 text-sm opacity-80">
                        <div className="glass p-4 rounded-xl border-white/5">
                            <p>📍 Junior App Developer | Worked on Google Clone projects.</p>
                        </div>
                        <div className="glass p-4 rounded-xl border-white/5">
                            <p>📍 E-commerce Owner | Managed "EL TOUFAN" clothing site with SEO optimization.</p>
                        </div>
                        <div className="glass p-4 rounded-xl border-white/5 flex gap-4 items-center">
                            <Video className="text-red-500" />
                            <p>📍 Multimedia Producer | Creating high-fidelity 8K realistic story videos for YouTube (3D scenes, voice-over, animation).</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-5xl font-black tracking-tighter flex items-center gap-4">
                        <Globe className="text-indigo-500" /> SERVICES
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        {['Translation', 'Content Writing', 'Image Design', 'Freelance Consulting'].map(s => (
                            <div key={s} className="p-3 glass rounded-lg border-white/5 text-center">{s}</div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);

const ContactSection = () => (
    <section id="contact" className="py-20 px-10 relative z-10 bg-black/50 backdrop-blur-3xl">
        <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-6xl font-black tracking-tighter underline decoration-blue-500 underline-offset-8">GET IN TOUCH</h2>
            <div className="flex flex-wrap justify-center gap-8">
                <motion.a whileHover={{ y: -5 }} href="https://www.facebook.com/share/18HScpnuPa/" target="_blank" className="flex items-center gap-2 glass px-6 py-3 rounded-full border-blue-500/20"><Facebook className="text-blue-600" /> Facebook</motion.a>
                <motion.a whileHover={{ y: -5 }} href="https://www.instagram.com/youssef_osama04?igsh=MXV2Y2o5MzE0d2c1dA==" target="_blank" className="flex items-center gap-2 glass px-6 py-3 rounded-full border-rose-500/20"><Instagram className="text-rose-500" /> Instagram</motion.a>
                <motion.a whileHover={{ y: -5 }} href="https://wa.me/201020451206" target="_blank" className="flex items-center gap-2 glass px-6 py-3 rounded-full border-emerald-500/20"><MessageSquare className="text-emerald-500" /> WhatsApp</motion.a>
                <motion.a whileHover={{ y: -5 }} href="tel:01020451206" className="flex items-center gap-2 glass px-6 py-3 rounded-full border-gray-500/20"><Phone className="text-blue-400" /> 01020451206</motion.a>
                <motion.a whileHover={{ y: -5 }} href="mailto:67yousef4543@gmail.com" className="flex items-center gap-2 glass px-6 py-3 rounded-full border-amber-500/20"><Mail className="text-amber-500" /> 67yousef4543@gmail.com</motion.a>
            </div>
        </div>
    </section>
);

export default function App() {
    return (
        <div className="relative w-full bg-[#050505] text-white">
            <AudioPlayer />

            {/* Hero Section */}
            <div className="h-screen w-full relative flex items-center overflow-hidden">
                {/* Background Ambience */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full"></div>

                {/* UI Overlay */}
                <div className="absolute inset-0 z-10 p-10 flex flex-col justify-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h1 className="text-[10vw] font-black leading-[0.8] tracking-tighter">
                            YOUSEF <br /> <span className="text-transparent" style={{ WebkitTextStroke: "1px white", opacity: 0.3 }}>OSAMA</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-mono text-blue-500 uppercase tracking-widest">
                            Computer Engineer / AI Specialist
                        </p>
                        <div className="flex gap-4">
                            <a href="#about" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full font-bold">ABOUT ME</a>
                            <a href="#contact" className="px-8 py-3 glass hover:bg-white/10 transition-colors rounded-full font-bold">CONTACT</a>
                        </div>
                    </motion.div>
                </div>

                {/* 3D Model Container - Shifted to Right Side */}
                <div className="absolute right-0 top-0 w-1/2 h-full z-0 hidden lg:block">
                    <Canvas camera={{ position: [0, 0, 7], fov: 40 }} dpr={[1, 2]}>
                        <color attach="background" args={['#050505']} />
                        <ambientLight intensity={1} />
                        <Suspense fallback={null}>
                            <Experience3D imagePath="./me.jpeg" />
                            <Environment preset="city" />
                        </Suspense>
                        <OrbitControls enableZoom={false} enablePan={false} />
                    </Canvas>
                </div>
            </div>

            <AboutSection />
            <ContactSection />

            <footer className="py-10 text-center opacity-30 text-xs tracking-widest border-t border-white/5">
                © 2026 YOUSEF OSAMA | AIE ENGINEER PORTFOLIO
            </footer>
        </div>
    );
}
