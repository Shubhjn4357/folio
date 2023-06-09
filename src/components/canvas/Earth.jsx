import React, { Suspense,useEffect,useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

//how to stop too many canvas old canvas will be lost error ?
 
const Earth = () => {
 
  const earth = useGLTF("./planet/scene.gltf");
  useEffect(()=>{
    return ()=>{
        earth.dispose()
    }
  },[earth])
  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
};

const EarthCanvas = () => {
  const canvasRef=useRef()
  useEffect(() => {
    const cleanup = () => {
      const renderer = canvasRef.current?.gl;
      if (renderer) {
        renderer.dispose(); // Dispose the WebGL renderer
      }
    };

    return cleanup; // Cleanup function will be called when the component unmounts
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
        />
        <Earth />
        
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
