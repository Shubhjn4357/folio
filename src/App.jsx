import { BrowserRouter } from "react-router-dom";

import { About, Contact, Hero, Navbar, Tech, Works ,Footer} from "./components";
import CustomCursor from "./components/CustomCursor";
const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <CustomCursor />
        <div className='effective-bg'>
          <Navbar />
          <Hero />
        </div>
        <About />
        <Tech />
        <Works />
        <div className='relative z-0'>
          <Contact />    
        </div>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;
