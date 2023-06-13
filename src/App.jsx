import { BrowserRouter } from "react-router-dom";

import { About, Contact, Hero, Navbar, Tech, Works, StarsCanvas ,Footer} from "./components";
const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        
          <Navbar />
          <Hero />
        
        <About />
        <Tech />
        <Works />
        <div className='relative z-0'>
          <Contact />        
        </div>
        <Footer/>
        <StarsCanvas />
      </div>
    </BrowserRouter>
  );
}

export default App;
