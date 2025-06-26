// "use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { createScreen2Triggers } from "./ScrollTriggers/ScreenTriggers";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Screen2 = () => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  // const gsapModules = useRef<any>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const numbersRef = useRef<HTMLDivElement[]>([]);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  //gère si le hover est fini sur les autre chiffres
  const AnimationClipCreator = useRef(false);

 

  useEffect(() => {
    setIsGsapReady(true);
  }, []);

  useEffect(() => {
    if (!isGsapReady || !containerRef.current) return;

    const tl = gsap.timeline();

    const triggers = createScreen2Triggers({
      containerRef,
      gsap,
      ScrollTrigger,
      timeline: tl,
      numbersRef,
      bottomBarRef,
      AnimationClipCreator,
    });

    return () => {
 
      triggers.mainSnap.kill();
      triggers.mainTriggerAnimLocal.kill();
      triggers.remisePositionInitiale.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isGsapReady]);

  return (
    <div
      ref={containerRef}
      id="screen2"
      className="relative h-screen w-full text-white overflow-hidden z-10"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-[rgb(16,16,16)]">
        <h1 className="ml-8 mt-28 text-3xl xl:text-5xl lg:mt-16 mb-6  bg-gradient-to-b from-gray-600 to-white bg-clip-text text-transparent">
          360° SERVICES
        </h1>

        <div className="grid sm:grid-cols-4 grid-cols-2 grid-rows-2 gap-y-4 sm:gap-0 max-w-screen-lg mx-auto">
          {[
            "AUDIT & IT CONSULTING",
            "DIGITAL SOLUTION",
            "DATA SOLUTION",
            "MARKETING & BRANDING",
          ].map((service, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) sectionsRef.current[index] = el;
              }}
              className={`${
                index % 2 === 0 ? "service-item-blue" : "service-item-orange"
              } cursor-pointer service-item border-l-3 border-white sm:pl-6 sm:pr-4`}
            >
              <div
                ref={(el) => {
                  if (el) numbersRef.current[index] = el;
                }}
                className={`${
                  // AnimationClipCreator.current ? "gradient-text-mask" : ""
                  index % 2 === 0 ? "gradient-text-mask gradient-text-mask-blue" : "gradient-text-mask gradient-text-mask-orange"
                } text-center text-[5rem] sm:text-[3rem] md:text-[8rem] text-[12rem] sm:mb-8 mb-4`}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              <div
                className={` ${
                  // AnimationClipCreator.current ? "gradient-text-mask" : ""
                  index % 2 === 0 ? "gradient-text-mask gradient-text-mask-blue" : "gradient-text-mask gradient-text-mask-orange"
                } text-center sm:text-left md:text-lg lg:text-xl xl:text-3xl text-ellipsis overflow-hidden`}
              >
                {service.split(" & ").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i === 0 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-2 sm:bottom-8 sm:p-0 w-full px-[var(--margeBodySection)] sm:px-[var(--margeBodySectionsm)]">
          <div
            ref={bottomBarRef}
            className="bg-black border-6 mt-20 flex justify-between items-center border border-white rounded-full sm:px-8 px-4 py-4"
          >
            <div className="md:text-md xl:text-xl">OUR SERVICES</div>
            <div className="md:text-md xl:text-xl">OPEN</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen2;
