import { MutableRefObject } from "react";
import { gsap } from "gsap";

// Screen 2 Triggers
interface Screen2TriggersProps {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  gsap: any;
  ScrollTrigger: any;
  timeline: gsap.Timeline;
  numbersRef: MutableRefObject<HTMLDivElement[]>;
  bottomBarRef: MutableRefObject<HTMLDivElement | null>;
  AnimationClipCreator: MutableRefObject<boolean>;
}

export const createScreen2Triggers = ({
  containerRef,
  gsap,
  ScrollTrigger,
  timeline,
  numbersRef,
  bottomBarRef,
  AnimationClipCreator,
}: Screen2TriggersProps) => {
  const element = document.querySelector("#screen2");

  const mainTriggerAnimLocal = ScrollTrigger.create({
    trigger: containerRef.current,
    start: "top center",
    end: "bottom center",
    // ease: "power2.inOut",
    animation: timeline,
    onEnter: () => {
      // if (!canTrigger()) return;
      const element = document.getElementById("screen2");
      if (!element) return;
      // document.body.style.overflow = "hidden";
      // DomUtils.disableScroll()
      const tl2 = gsap.timeline();

      numbersRef.current.forEach((number) => {
        tl2.fromTo(
          number,
          {
            yPercent: -100,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
          },
          "<"
        );
      });

      tl2.fromTo(
        bottomBarRef.current,
        {
          yPercent: 100,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          onComplete: () => {
            // document.body.style.overflow = "";
            setTimeout(() => {
              AnimationClipCreator.current = true;
            }, 1000);
          },
        },
        ">"
      );
    },
  });

  const mainSnap = ScrollTrigger.create({
    trigger: element,
    start: "top bottom", // Commence un peu avant d'atteindre screen3
    end: "top top",
    // markers: true,
    snap: {
      snapTo: 1, // Snap uniquement au début de screen3
      duration: 1,
      ease: "power2.out",
      inertia: false,
      directional: true,
    },
  });

  return {
    mainTriggerAnimLocal,
    mainSnap,
  };
};

// Screen 3 Triggers
interface Screen3TriggersProps {
  gsap: any;
  ScrollTrigger: any;
  setIsVisible: (value: boolean) => void;
}

export const createScreen3Triggers = ({
  // gsap,
  ScrollTrigger,
  setIsVisible,
}: Screen3TriggersProps) => {
  const element = document.querySelector("#screen3");

  const mainSnap = ScrollTrigger.create({
    trigger: element,
    start: "top bottom", // Commence un peu avant d'atteindre screen3
    end: "top top",
    // markers: true,
    onEnter: () => {
      // alert("onEnter");
      setIsVisible(true);
    },

    // markers: true,
    snap: {
      snapTo: 1, // Snap uniquement au début de screen3
      duration: 1,
      ease: "power2.out",
      inertia: false,
      directional: true,
    },

  });

  return { mainSnap };
};

// Screen 4 Triggers
interface Screen4TriggersProps {
  gsap: any;
  ScrollTrigger: any;
}

export const createScreen4Triggers = ({
  gsap,
  ScrollTrigger,
}: Screen4TriggersProps) => {
  const element = document.querySelector("#screen4");

  const mainSnap = ScrollTrigger.create({
    trigger: element,
    start: "top bottom", // Commence un peu avant d'atteindre screen3
    end: "top top",
    snap: {
      snapTo: 1, // Snap uniquement au début de screen3
      duration: 1,
      ease: "power2.out",
      inertia: false,
      directional: true,
    },
  });

  return { mainSnap };
};

// Screen 5 Triggers
interface Screen5TriggersProps {
  gsap: any;
  ScrollTrigger: any;
}

export const createScreen5Triggers = ({
  gsap,
  ScrollTrigger,
}: Screen5TriggersProps) => {
  const element = document.querySelector("#screen5");

  const mainSnap = ScrollTrigger.create({
    trigger: element,
    start: "top bottom", // Commence un peu avant d'atteindre screen3
    end: "top top",
    snap: {
      snapTo: 1, // Snap uniquement au début de screen3
      duration: 1,
      ease: "power2.out",
      inertia: false,
      directional: true,
    },

  });

  return { mainSnap };
};

// Screen 6 Triggers
interface Screen6TriggersProps {
  gsap: any;
  ScrollTrigger: any;
}

export const createScreen6Triggers = ({
  gsap,
  ScrollTrigger,
}: Screen6TriggersProps) => {
  const element = document.querySelector("#screen6");

  const mainSnap = ScrollTrigger.create({
    trigger: element,
    start: "top bottom", // Commence un peu avant d'atteindre screen3
    end: "top top",
    // markers: true,
    snap: {
      snapTo: 1, // Snap uniquement au début de screen3
      duration: 1,
      ease: "power2.out",
      inertia: false,
      directional: true,
    },
  });

  return { mainSnap };
};
