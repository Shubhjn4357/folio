import { useState, useEffect, Suspense,useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import CanvasLoader from "../Loader";

const Stars = (props) => {
  const ref = useRef();

  useFrame(() => {
    // Rotate the star around its own axis
    ref.current.rotation.y += 0.01;
    ref.current.rotation.x += 0.01;
  });

  return (
    <Points ref={ref}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <PointMaterial color="#ffffff" size={0.02} />
    </Points>
  )
};

const StarsCanvas = () => {
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
    <div className='w-full h-auto absolute inset-0 z-[-1]'>
      <Canvas ref={canvasRef} camera={{ position: [-4, 0, 1] }}>
        <Suspense fallback={<CanvasLoader />}>
          <Stars />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
