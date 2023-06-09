import { BrowserRouter } from "react-router-dom";

import { About, Contact, Hero, Navbar, Tech, Works, StarsCanvas ,Footer} from "./components";
import { herobg } from "./assets";
const App = () => {
  return (
    <BrowserRouter>
      <div className='relative  z-0 bg-primary'>
        <div style={{'background':`#080038 linear-gradient(90deg, #160030,#1d013d) url(${herobg})`}} className='hero'>
          <Navbar />
          <Hero />
        </div>
        <About />
        <Tech />
        <Works />
        <div className='relative z-0'>
          <Contact />
          <StarsCanvas />
        </div>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;
