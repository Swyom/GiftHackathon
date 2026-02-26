import React from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Products } from "./components/Products";
import { About } from "./components/About";
import { Testimonials } from "./components/Testimonials";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

const App = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Products />
      <About />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
};

export default App;