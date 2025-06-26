"use client";

import { useEffect, useRef, useState } from "react";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // ou autre breakpoint
    };
    // alert("onEnter");
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export default function Interstitial() {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    // Créer une timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current as HTMLElement,
        start: "top bottom",
        end: "100% top",
        // markers: true,
        onEnter: () => {
          // alert("onEnter");
        },
        snap: {
          snapTo: 1,
          duration: 3,
          ease: "power2.out",
          inertia: false,
          directional: true,
        },
      },
    });

    // Ajouter des animations à la timeline (même si elles sont vides pour l'instant)
    // tl.to(ref.current, { duration: 0.1, ease: "none" });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, [isMobile]);

  return (
    <>
      {!isMobile ? (
        <div
          ref={ref}
          id="interstitial"
          // ref={ref}
          className="w-full h-full"
          style={{
            height: "300vh",
          }}
        ></div>
      ) : null}
    </>
  );
}
