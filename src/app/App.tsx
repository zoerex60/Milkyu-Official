import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ComingSoon } from './components/ComingSoon';
import { Contact } from './components/Contact';

export default function App() {
  return (
    <div className="font-sans text-gray-900 bg-white selection:bg-pink-200 selection:text-pink-900 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <ComingSoon />
        <Contact />
      </main>
    </div>
  );
}
