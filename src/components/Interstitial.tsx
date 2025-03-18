"use client";

import React, { useEffect, useRef, useState } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // ou autre breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export default function Interstitial() {
  const isMobile = useIsMobile();
  

  return (
    <>
      {!isMobile ? (
        <div
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
