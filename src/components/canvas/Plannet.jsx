import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const PlannetModel = ({ isMobile }) => {
  const scene = useGLTF("/lpe/scene.gltf");

  useEffect(() => {
    return () => {
      scene.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [scene]);

  return (
    <mesh position={[0, isMobile ? -4 : -5, 0]}>
      <ambientLight intensity={0.01} />
      <hemisphereLight intensity={0.1} groundColor='#2a003d' />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-10, -5, -5]} intensity={0.6} />
      <spotLight
        position={[-30, 50, 12]}
        angle={0.10}
        penumbra={1}
        intensity={1}
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={scene.scene}
        scale={isMobile ? 1.3 : 1.9}
        position-y={0}
        rotation-y={0}
      />
    </mesh>
  );
};

const PlannetCanvas = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Canvas
      shadows="soft"
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <PlannetModel isMobile={isMobile} />
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Suspense>
    </Canvas>
  );
};

export default PlannetCanvas;
