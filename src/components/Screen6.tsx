"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import RippleShader from "./RippleShader";
import { createScreen6Triggers } from "./ScrollTriggers/ScreenTriggers";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);


interface Screen6Props {
  setAnimateCanvas1: (value: boolean) => void;
}

export const Screen6ClientsEtPartners = ({
  setAnimateCanvas1,
}: Screen6Props) => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animateCanvas2, setAnimateCanvas2] = useState(false);

  useGSAP(() => {
    setIsGsapReady(true);
  }, []);

  useGSAP(() => {
    if (!isGsapReady) return;

    const element = document.querySelector("#screen6");

    const triggers = createScreen6Triggers({
      gsap,
      ScrollTrigger
    });
    
    const triggerAnimateCanvas2 = ScrollTrigger.create({
      trigger: element,
      start: "top 100%",
      end: "top 100%",
      onEnter: () => {
        setAnimateCanvas2(true);
      },
      onLeaveBack: () => {
      },
    });

    const triggerAnimateCanvas1 = ScrollTrigger.create({
      trigger: element,
      start: "bottom 100%",
      end: "bottom 100%",
      onEnter: () => {
        // setAnimateCanvas1(false);
      },
      onLeaveBack: () => {
        // setAnimateCanvas1(true);
        setAnimateCanvas2(false);
      },
    });

    

    return () => {
      triggers.mainSnap.kill();
      triggerAnimateCanvas1.kill();
      triggerAnimateCanvas2.kill();
    };
  }, [isGsapReady]);

  return (
    <div
      ref={containerRef}
      id="screen6"
      className="relative w-full min-h-screen bg-[rgb(16,16,16)] text-white overflow-hidden z-0"
    >
      <RippleShader animate={animateCanvas2} />
      <div
        className="absolute px-[var(--margeBodySection)] sm:px-[var(--margeBodySectionsm)] sm:top-1/3 mt-48 sm:mt-32 sm:h-1/3 
        gap-1
        sm:gap-2
        grid-cols-3 grid-rows-8
        sm:grid-cols-6 sm:grid-rows-4
         xl:grid-cols-8 xl:grid-rows-3 
         
         w-full mx-auto 
      inline-grid   gap-y-2 
      place-items-center"
      >
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/airfrance.png"
            alt="Air France"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/renault.png"
            alt="Renault"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/total.png"
            alt="Total Energies"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/as24.png"
            alt="AS 24"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/lcl.png"
            alt="LCL"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/mastercard.png"
            alt="Mastercard"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/kesato.webp"
            alt="Kesato"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/imani.png"
            alt="IMANI"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/aldiwan.png"
            alt="Aldiwan"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/cafe.jpeg"
            alt="Cafe Organic"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12p-1">
          <img
            loading="lazy"
            src="/ts.svg"
            alt="touch et sell"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/celio.png"
            alt="celio"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/comptoir.jpeg"
            alt="Comptoir"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/yacht.png"
            alt="Yacht"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/dubai.png"
            alt="Dubai"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/bsi.png"
            alt="BSI"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/neonautica.webp"
            alt="Neonautica"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/HR.png"
            alt="HR"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/ericbompard.png"
            alt="Eric Bompard"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/princessetam.png"
            alt="Princess Etam"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/facebook.png"
            alt="Facebook"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/gsuite.png"
            alt="GSuite"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/googleana.png"
            alt="Google Analytics"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-8 sm:max-h-12 p-1">
          <img
            loading="lazy"
            src="/miro.png"
            alt="Miro"
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

      <h1 className="text-center sm:text-left sm:ml-8 text-3xl xl:text-5xl mt-28 sm:mt-32 mb-24 bg-gradient-to-b from-gray-900 to-white bg-clip-text text-transparent">
        CLIENTS & PARTNERS
      </h1>
    </div>
  );
};

export default Screen6ClientsEtPartners;
