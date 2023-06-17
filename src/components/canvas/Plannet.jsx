import React, { Suspense, useEffect, useRef, useState} from "react";
import { Canvas} from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const PlannetModel = ({ isMobile }) => {
  const scene = useGLTF("/lpe/scene.gltf");
  useEffect(()=>{
    return ()=>{
        scene.dispose()
    }
  },[scene])
  return (
    <mesh position={[0,isMobile?-4:-5,0]}>
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
        object={scene.scene}
        scale={isMobile?1.3:1.9}
        position-y={0}
        rotation-y={0}
      />
      </mesh>
  );
};

const PlannetCanvas = () => {
  const canvasRef=useRef()
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const cleanup = () => {
      const renderer = canvasRef.current?.gl;
      if (renderer) {
        renderer.dispose(); // Dispose the WebGL renderer
      }
    };

    return cleanup; // Cleanup function will be called when the component unmounts
  }, []);
  useEffect(() => {
    // Update the isMobile state based on your logic
    // This can be done using window.innerWidth or a media query library
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Listen for window resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the event listener
    };
  }, []);

  return (<Canvas ref={canvasRef}
                 shadows="soft"
                  frameloop="demand"
                  dpr={[1, 2]}
                  gl={{ preserveDrawingBuffer: true }}
                  camera={{
                    fov: 45,
                    near: 0.1,
                    far: 200,
                    position: [-4, 3, 6],
                  }}>
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
