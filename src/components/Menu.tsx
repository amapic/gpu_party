// "use client";
import  { useEffect, useRef, useState } from "react";
import gsap from "gsap";
// import { getDistanceFromTop } from "@/utils/utils";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const MenuItem = ({ text, id }: { text: string; id: string }) => {
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  
  // Fonction pour vérifier si un élément est visible
  const isElementVisible = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // Fonction pour essayer de trouver l'élément
  const findElement = () => {
    if (!elementRef.current) {
      elementRef.current = document.getElementById(id);
    }
    return elementRef.current;
  };

  // Exemple d'utilisation dans un useEffect
  useEffect(() => {
    const checkVisibility = () => {
      // console.log("checkVisibility" , id);
      const element = findElement();
      if (element) {
        const isVisible = isElementVisible(element);
        setIsVisible(isVisible);
      }
    };

    // Essayer de trouver l'élément immédiatement
    checkVisibility();
    
    // Si l'élément n'existe pas encore, essayer périodiquement
    const intervalId = setInterval(() => {
      if (!findElement()) {
        checkVisibility();
      } else {
        // clearInterval(intervalId);
      }
    }, 100);

    // Nettoyer l'intervalle après 5 secondes maximum
    // const timeoutId = setTimeout(() => {
    //   clearInterval(intervalId);
    // }, 5000);

    window.addEventListener("scroll", checkVisibility, { passive: false });

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      // clearInterval(intervalId);
      // clearTimeout(timeoutId);
    };
  }, [id]);

  const scrollToSection = () => {
    const element = findElement();
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToSection();
    }
  };

  return (
    <button
      data-submenu
      className="flex items-center cursor-pointer group z-10 bg-transparent border-none p-0"
      onClick={scrollToSection}
      onKeyDown={handleKeyDown}
      aria-label={`Aller à la section ${text}`}
      tabIndex={0}
    >
      <div
        ref={textRef}
        data-text
        className="z-10 cursor-pointer hover:font-white text-[rgb(230,230,230)] text-sm opacity-0 -translate-x-[10px] w-[200px] leading-4 text-right pr-4"
      >
        {text}
      </div>
      <div
        ref={lineRef}
        className={`group-hover:bg-white h-[3px] ${
          isVisible ? "bg-white" : "bg-[rgb(50,50,50)]"
        } w-[24px] cursor-pointer z-10 transition-colors duration-200`}
      />
    </button>
  );
};

const Menu = () => {
  // Variable globale pour tracker l'animation en cours
  let isAnimating = false;
  const menuItems = [
    ["Introduction", "hero"],
    ["Services", "screen2"],
    ["About Us", "screen3"],
    ["Clients & Partners", "screen6"]
    // ["Contact", "screen6"],
  ];

  const menuContainerRef = useRef<HTMLDivElement>(null);
  const helloRef = useRef<HTMLButtonElement>(null);
  const bOneRef = useRef<HTMLDivElement>(null);
  const barreContainerRef = useRef<HTMLDivElement>(null);
  const fakeContainerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const initialHeightRef = useRef<number>(0);
  let currentAnimation: gsap.core.Timeline | null = null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const container = menuContainerRef.current;
    const fakeContainer = fakeContainerRef.current;
    // fakeContainerRef
    initialHeightRef.current = container?.offsetHeight || 0;

    const handleMouseEnter = () => {
      if (isAnimating) return;
      isAnimating = true;

      if (currentAnimation) {
        currentAnimation.kill();
      }

      const timeline = gsap.timeline();
      currentAnimation = timeline;
      const stagger = 0.1;

      const items = container?.querySelectorAll("[data-submenu]");

      timeline.to(
        items,
        {
          marginBottom: 10,
          duration: 0.3,
          stagger: stagger,
          ease: "power2.out",
        },
        "<"
      );

      const textElements = Array.from(
        container?.querySelectorAll("[data-text]") || []
      );

      const subMenuElements = Array.from(
        container?.querySelectorAll("[data-submenu]") || []
      ).reverse();

      // timeline.to(subMenuElements, {
      //   y: (index) => 40 - index * 10,
      //   duration: 0.3,
      //   ease: "power2.out",
      // });

      // Utiliser la hauteur initiale stockée
      // timeline.to(container, {
      //   height: initialHeightRef.current * 2.2,
      //   duration: 0.3,
      //   ease: "power2.out"
      // },"<");

      // timeline.to(fakeContainer, {
      //   scaleY: 1.2,
      //   duration: 0.3,
      //   ease: "power2.out"
      // },"<");

      timeline.to(
        textElements,
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: stagger,
          ease: "power2.out",
          onComplete: () => {
            // setAnimationRef(animationRef+1)
          },
        },
        ">"
      );
    };

    const handleMouseLeave = () => {
      const timeline = gsap.timeline();
      // currentAnimation = timeline;

      if (currentAnimation) {
        currentAnimation.kill();
      }

      const items = container?.querySelectorAll("[data-submenu]");

      timeline.to(container, {
        height: initialHeightRef.current,
        duration: 0.3,
        ease: "power2.out",
      });

      timeline.to(
        items,
        {
          marginBottom: 1,
          duration: 0.3,
          ease: "power2.out",
        },
        ">"
      );

      const textElements = Array.from(
        container?.querySelectorAll("[data-text]") || []
      );

      const subMenuElements = Array.from(
        container?.querySelectorAll("[data-submenu]") || []
      ).reverse();

      timeline.to(subMenuElements, {
        y: (index) => 0,
        duration: 0.3,
        ease: "power2.out",
      });

      // timeline.to(container, {
      //   height: initialHeightRef.current,
      //   duration: 0.3,
      //   ease: "power2.out"
      // });

      timeline.to(
        textElements,
        {
          opacity: 0,
          x: -10,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            isAnimating = false;
            // animationRef.current+=1
          },
        },
        ">"
      );
    };

    container?.addEventListener("mouseover", handleMouseEnter);
    container?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container?.removeEventListener("mouseover", handleMouseEnter);
      container?.removeEventListener("mouseleave", handleMouseLeave);
      // Nettoyer l'animation au démontage
      if (currentAnimation) {
        currentAnimation.kill();
      }
    };
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      helloRef.current,
      {
        y: -300, // Position de départ (à gauche)
        opacity: 0,
      },
      {
        y: 0, // Position finale (position actuelle)
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      bOneRef.current,
      {
        y: -300, // Position de départ (à gauche)
        opacity: 0,
      },
      {
        y: 0, // Position finale (position actuelle)
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      hamburgerRef.current,
      {
        y: -300, // Position de départ (à gauche)
        opacity: 0,
      },
      {
        y: 0, // Position finale (position actuelle)
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      menuContainerRef.current,
      {
        x: 300, // Position de départ (à gauche)
        opacity: 0,
      },
      {
        x: 0, // Position finale (position actuelle)
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      }
    );
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    // alert("scrollToSection");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <div>
        <header className="fixed h-16 sm:h-27 w-screen flex flex-col items-center justify-between text-white z-20">
          <div className="bg-[rgb(16,16,16)] h-4/5 w-full"></div>
          <div className="bg-gradient-to-b from-[rgb(16,16,16)] to-transparent h-1/5 w-full"></div>
        </header>
      </div>
      {/* <div className="fixed top-27 h-2 w-screen bg-gradient-to-b from-[rgb(16,16,16)] to-transparent z-20"></div> */}

      <div className="px-4 fixed top-0 left-0 w-screen flex justify-between items-center z-30">
        <div
          ref={bOneRef}
          className=" compressed-text sm:fixed text-white sm:top-6 sm:left-8 font-['Prompt'] z-20"
        >
          <span className="text-left text-xl xl:text-2xl b-compressed-text">
            U{" "}
          </span>
          <span className="text-xl xl:text-2xl">consulting</span>
        </div>

        <button
          ref={helloRef}
          className="px-2 z-20 sm:w-48 text-[0.8rem] sm:text-md sm:fixed sm:top-8 sm:right-10 border border-purple text-purple rounded-full"
          aria-label="Nous contacter"
        >
          SAY HELLO
        </button>
        <div className="flex pt-1 sm:hidden" ref={hamburgerRef}>
          {/* Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className=" flex flex-col justify-center items-center w-10 h-10 space-y-2 z-50"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
          >
            <span
              className={`block w-8 h-0.5 bg-purple transition-transform duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2.5" : ""
              }`}
              aria-hidden="true"
            ></span>
            <span
              className={`block w-8 h-0.5 bg-purple transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
              aria-hidden="true"
            ></span>
            <span
              className={`block w-8 h-0.5 bg-purple transition-transform duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""
              }`}
              aria-hidden="true"
            ></span>
          </button>

          {/* Menu Content */}
        </div>
      </div>
      <div
        ref={menuContainerRef}
        className="pr-1 hidden sm:block fixed top-30 right-10 flex-col  pl-1 z-20 "
      >
        <div className="">
          {menuItems.map((item, index) => (
            <MenuItem key={index} text={item[0]} id={item[1]} />
          ))}
        </div>
        {/* <div ref={fakeContainerRef} className=" absolute top-0 right-0 w-full h-[200px] z-0"></div> */}
      </div>
      {/* ["Introduction", "hero"],
    ["Services", "screen2"],
    ["About Us", "screen3"],
    ["Clients & Partners", "screen6"] */}
      {isMenuOpen && (
        <div className="sm:hidden">
          {/* <div className="fixed top-0 right-4 w-full h-full bg-black opacity-50 z-40"></div> */}
          <div className="fixed text-right top-16 right-4 text-white bg-transparent z-50">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-white bg-transparent border-none p-0 text-right block w-full"
              aria-label="Aller à la section Introduction"
            >
              . Introduction
            </button>
            <button
              onClick={() => scrollToSection("screen2")}
              className="text-white bg-transparent border-none p-0 text-right block w-full"
              aria-label="Aller à la section Services"
            >
              . Services
            </button>
            <button
              onClick={() => scrollToSection("screen3")}
              className="text-white bg-transparent border-none p-0 text-right block w-full"
              aria-label="Aller à la section About Us"
            >
              . About Us
            </button>
            <button
              onClick={() => scrollToSection("screen6")}
              className="text-white bg-transparent border-none p-0 text-right block w-full"
              aria-label="Aller à la section Clients"
            >
              . Clients
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
