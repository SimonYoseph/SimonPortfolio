"use client";

import { useEffect, useRef } from 'react';
// @ts-expect-error - no types available
import LiquidBackground from 'threejs-components/build/backgrounds/liquid1.min.js';

interface LiquidApp {
  liquidPlane: {
    material: { metalness: number; roughness: number };
    uniforms: { displacementScale: { value: number } };
  };
  loadImage: (url: string) => void;
  setRain: (rain: boolean) => void;
}

export default function LiquidBackgroundComponent({ fadeOut }: { fadeOut: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<LiquidApp | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Map touch events to PointerEvents since the library internally binds to 
    // pointermove on document.body
    const handleTouch = (e: TouchEvent) => {
      // Prevent browser default scrolling behavior to ensure constant tracking
      if (e.cancelable && e.type === "touchmove") {
        e.preventDefault();
      }
      
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const pointerEvent = new PointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "touch",
          isPrimary: true,
          clientX: touch.clientX,
          clientY: touch.clientY,
          bubbles: true,
          cancelable: true
        });
        document.body.dispatchEvent(pointerEvent);
      }
    };

    window.addEventListener("touchstart", handleTouch, { passive: false });
    window.addEventListener("touchmove", handleTouch, { passive: false });

    // Ensure custom fonts are fully loaded before rendering the canvas text
    document.fonts.ready.then(() => {
      if (!canvasRef.current) return;
      const app = LiquidBackground(canvasRef.current);
      appRef.current = app;
      
      // Dynamically match canvas internal text size based on screen width
    // to map 1:1 with the Tailwind text on the main page.
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    const textCanvas = document.createElement('canvas');
    // Using a 1:1 ratio with the screen ensures the text isn't warped 
    // because ThreeJS will map this texture directly onto the screen plane.
    textCanvas.width = w * 2; // x2 for Retina/High-DPI sharpness
    textCanvas.height = h * 2;
    const ctx = textCanvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);
      ctx.fillStyle = '#ffffff';
      
      // Calculate font size based on Tailwind breakpoints
      let fontSize = 48; // text-5xl
      let gap = 32; // gap-8
      if (w >= 768) {
        fontSize = 96; // md:text-[6rem]
        gap = 64; // md:gap-16
      } else if (w >= 640) {
        fontSize = 60; // sm:text-6xl
        gap = 48; // sm:gap-12
      }
      
      const scaledFontSize = fontSize * 2;
      const scaledGap = gap * 2;
      
      ctx.font = `900 ${scaledFontSize}px Montserrat, system-ui, sans-serif`; 
      ctx.letterSpacing = `${scaledFontSize * 0.3}px`; // replicate tracking-[0.3em]
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // With leading-none and flex layout, vertical separation between word centers
      // is exactly half the total font size plus half the gap
      const verticalOffset = (scaledFontSize / 2) + (scaledGap / 2);
      
      ctx.fillText('SIMON', textCanvas.width / 2, textCanvas.height / 2 - verticalOffset);
      ctx.fillText('YOSEPH', textCanvas.width / 2, textCanvas.height / 2 + verticalOffset);
      
      app.loadImage(textCanvas.toDataURL());
    }

    app.liquidPlane.material.metalness = 0.75;
    app.liquidPlane.material.roughness = 0.25;
    app.liquidPlane.uniforms.displacementScale.value = 5;
    app.setRain(false);
    });

    return () => {
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
      // Cleanup if necessary
    };
  }, []);

  // Gracefully settle the liquid ripples while fading out
  useEffect(() => {
    if (fadeOut && appRef.current && appRef.current.liquidPlane) {
      const fps = 60;
      let currentVal = 5; // Start displacement
      const targetVal = 0; // Flat
      const step = 5 / (1.5 * fps); // Scale to 1.5 seconds

      const interval = setInterval(() => {
        currentVal -= step;
        if (currentVal <= targetVal) {
          currentVal = targetVal;
          clearInterval(interval);
        }
        if (appRef.current && appRef.current.liquidPlane) {
          appRef.current.liquidPlane.uniforms.displacementScale.value = currentVal;
        }
      }, 1000 / fps);
      
      return () => clearInterval(interval);
    }
  }, [fadeOut]);

  return (
    <canvas 
      ref={canvasRef} 
      id="canvas" 
      className="w-full h-full object-cover touch-none block" 
    />
  );
}

