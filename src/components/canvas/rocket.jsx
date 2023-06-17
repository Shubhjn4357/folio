import React, { Suspense ,useEffect,useRef} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Rocket = () => {
  const rocket = useGLTF("./rocket/scene.gltf");

  return (
    <mesh position={[0,1,0]}>
    <hemisphereLight intensity={0.15} groundColor='#2a003d' />
    <spotLight
      position={[-20, 50, 10]}
      angle={0.12}
      penumbra={1}
      intensity={1}
      castShadow
      shadow-mapSize={1024}
    />
    <pointLight intensity={1} />
    <primitive object={rocket.scene} 
               scale={1} 
               position-y={0} 
               rotation-y={0}
               rotation-x={1.5} />
    </mesh>
  );
};

const RocketCanvas = () => {
  const canvasRef = useRef();

  useEffect(() => {
    return () => {
      const canvas = canvasRef.current;
      const renderer = canvas?.getGlContexts()?.webgl?.renderer;

      if (renderer) {
        // Clean up and dispose the renderer
        renderer.forceContextLoss();
        renderer.dispose();
      }
    };
  }, []);
  return (
    <Canvas ref={canvasRef}
      shadows
      frameloop='demand'
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
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Rocket />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default RocketCanvas;
