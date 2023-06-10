import { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

const Typist=({words,delay,loop})=>{
  const cursorChars = ['#', '%', '&', '-', '+', '_', '?', '/', '\\', '='];
  const [cursorIndex, setCursorIndex] = useState(0);
  const [cursor,setCursor]=useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorIndex(prevIndex => (prevIndex + 1) % cursorChars.length);
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const cursorStyle = cursorChars[cursorIndex];

    return (
        <Typewriter loop={loop?loop:1}
                    words={words}
                    deleteSpeed={100}
                    typeSpeed={100}
                    cursor={cursor}
                    cursorBlinking={false}
                    delaySpeed={delay?delay:0}
                    cursorStyle={cursorStyle}
                    onLoopDone={()=>setCursor(false)}
                    cursorColor="#4a65ff" />
    )
}
export default Typist;