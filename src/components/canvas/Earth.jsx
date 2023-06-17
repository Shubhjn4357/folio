import React, { Suspense,useEffect,useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, Stars, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";


 
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
      <Stars  radius={50} depth={1} speed={1} count={20000} saturation={1} fade={true}/>
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
