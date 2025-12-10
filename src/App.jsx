import { BrowserRouter } from "react-router-dom";
import { About, Contact, Hero, Navbar, Tech, Works, Footer } from "./components";
import CustomCursor from "./components/CustomCursor";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className='relative z-0 bg-primary transition-colors duration-300'>
          <CustomCursor />
          <div className='effective-bg transition-colors duration-300'>
            <Navbar />
            <Hero />
          </div>
          <About />
          <Tech />
          <Works />
          <div className='relative z-0'>
            <Contact />
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
