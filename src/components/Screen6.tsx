"use client";

import { useEffect, useRef, useState } from "react";
import RippleShader from "./RippleShader";
import { createScreen6Triggers } from "./ScrollTriggers/ScreenTriggers";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ClientLogo from "./ClientLogo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Données des clients optimisées
const clientsData = [
  { src: "/airfrance.png", alt: "Air France" },
  { src: "/renault.png", alt: "Renault" },
  { src: "/total.png", alt: "Total Energies" },
  { src: "/as24.png", alt: "AS 24" },
  { src: "/lcl.png", alt: "LCL" },
  { src: "/mastercard.png", alt: "Mastercard" },
  { src: "/kesato.webp", alt: "Kesato" },
  { src: "/imani.png", alt: "IMANI" },
  { src: "/aldiwan.png", alt: "Aldiwan" },
  { src: "/cafe.jpeg", alt: "Cafe Organic" },
  { src: "/ts.svg", alt: "touch et sell" },
  { src: "/celio.png", alt: "celio" },
  { src: "/comptoir.jpeg", alt: "Comptoir" },
  { src: "/yacht.png", alt: "Yacht" },
  { src: "/dubai.png", alt: "Dubai" },
  { src: "/bsi.png", alt: "BSI" },
  { src: "/neonautica.webp", alt: "Neonautica" },
  { src: "/HR.png", alt: "HR" },
  { src: "/ericbompard.png", alt: "Eric Bompard" },
  { src: "/princessetam.png", alt: "Princess Etam" },
  { src: "/facebook.png", alt: "Facebook" },
  { src: "/gsuite.png", alt: "GSuite" },
  { src: "/googleana.png", alt: "Google Analytics" },
  { src: "/miro.png", alt: "Miro" }
];

interface Screen6Props {
  setAnimateCanvas1: (value: boolean) => void;
}

export const Screen6ClientsEtPartners = ({
  setAnimateCanvas1,
}: Screen6Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animateCanvas2, setAnimateCanvas2] = useState(false);

  useGSAP(() => {
    const triggers = createScreen6Triggers({
      gsap,
      ScrollTrigger,
    });

    return () => {
      triggers.mainSnap.kill();
    };
  }, []);

  useEffect(() => {
    setAnimateCanvas2(true);
    setAnimateCanvas1(false);
  }, [setAnimateCanvas1]);

  return (
    <div
      ref={containerRef}
      id="screen6"
      className="relative w-full min-h-screen bg-[rgb(16,16,16)] text-white overflow-hidden z-0"
    >
      <RippleShader animate={animateCanvas2} />
      <div
        className="absolute px-[var(--margeBodySection)] sm:px-[var(--margeBodySectionsm)] sm:top-1/3 mt-48 sm:mt-32 sm:h-1/3 
        gap-1 sm:gap-2
        grid-cols-3 grid-rows-8
        sm:grid-cols-6 sm:grid-rows-4
        xl:grid-cols-8 xl:grid-rows-3 
        w-full mx-auto 
        inline-grid gap-y-2 
        place-items-center"
      >
        {clientsData.map((client, index) => (
          <ClientLogo
            key={index}
            src={client.src}
            alt={client.alt}
            index={index}
          />
        ))}
      </div>

      <h1 className="text-center sm:text-left sm:ml-8 text-3xl xl:text-5xl mt-28 sm:mt-32 mb-24 bg-gradient-to-b from-gray-900 to-white bg-clip-text text-transparent">
        CLIENTS & PARTNERS
      </h1>
    </div>
  );
};

export default Screen6ClientsEtPartners;
