import React, { Suspense, useEffect, useState ,useRef} from "react";
import { Canvas} from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const PlannetModel = ({ isMobile }) => {
  const plannet = useGLTF("/lpe/scene.gltf",true);
  return (
    <mesh position={isMobile?[0,-4,0]:[0,-5,0]}>
    <ambientLight intensity={0.01} />
    <hemisphereLight intensity={0.1} groundColor='#2a003d' />
      <spotLight
        position={[-30, 50, 12]}
        angle={0.10}
        penumbra={1}
        intensity={1}
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={plannet.scene}
        scale={isMobile?1.5:2}
      />
      </mesh>
  );
};

const PlannetCanvas = () => {
  
  const [isMobile, setIsMobile] = useState(false);
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

  return (<Canvas ref={canvasRef}>
     <Suspense fallback={<CanvasLoader />}> 
       <PlannetModel isMobile={isMobile}/>
       <OrbitControls 
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2} />
      </Suspense>
  </Canvas>)
};

export default PlannetCanvas;
