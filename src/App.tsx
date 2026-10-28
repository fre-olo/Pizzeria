import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import OrderSection from "./components/OrderSection";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Menu />
        <OrderSection />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
