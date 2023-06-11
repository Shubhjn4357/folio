import React, { Suspense, useEffect, useState } from "react";
import { Canvas} from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const PlannetModel = ({ isMobile }) => {
  const plannet = useGLTF("./lpe/scene.gltf");
  // position={isMobile?[0,-3,0]:[0,-4,0]}
  return (
    <mesh position={[0,isMobile?-3:-4,0]}>
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
      <primitive
        object={plannet.scene}
        scale={isMobile?1.2:1.7}
        maxPolarAngle={Math.PI/2}
        minPolarAngle={Math.PI/2}
      />
      <Preload all />
     </mesh>
  );
};

const PlannetCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ position: [-4,-4, -5], near: 0.1,
        far: 200,fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
         autoRotate
         enableZoom={false}
         maxPolarAngle={Math.PI/2}
         minPolarAngle={Math.PI/2}
        />
        <PlannetModel isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default PlannetCanvas;
