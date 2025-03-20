import React, { lazy } from "react";
import Screen2 from "./Screen2.tsx";
import { Hero } from "./Hero";
import Menu from "./Menu";
import { Screen3, Screen4, Screen5 } from "./Screen345";
// const Screen3 = lazy(() => import("./Screen345").then((module) => ({ default: module.Screen3 })));
// const Screen4 = lazy(() => import("./Screen345").then((module) => ({ default: module.Screen4 })));
// const Screen5 = lazy(() => import("./Screen345").then((module) => ({ default: module.Screen5 })));
import Interstitial from "./Interstitial";
// import { Scene } from "@/components/Scene";
import Screen6 from "./Screen6";
// import CustomGeometryParticles from "@/components/Particle";
import { useRef, useState, useEffect, memo, useMemo } from "react";
// const AppHero = memo(Hero);
// import { WaitingScreen } from "@/components/waitingScreen";
// import { DomUtils } from "@/utils/utils";

import "../styles/index.css";

function App() {
  const paramScene = useRef<number>(0);
  const [sceneLoaded, setSceneLoaded] = useState(true);
  const [animateCanvas1, setAnimateCanvas1] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className={`content`}>
      {/* <WaitingScreen setSceneLoaded={setSceneLoaded}/> */}
      {/* {!sceneLoaded && <WaitingScreen setSceneLoaded={setSceneLoaded} />} */}
      {/* <Scene param={paramScene} setSceneLoaded={setSceneLoaded} animateCanvas1={animateCanvas1} /> */}
      {/* <CustomGeometryParticles  /> */}
      {sceneLoaded && <Menu /> }
      <Hero />
      <Screen2 />
      <Screen3 />
      <Interstitial />
      <Screen4 />
      <Screen5 />
      <Screen6 setAnimateCanvas1={setAnimateCanvas1} />
    </div>
  );
}

export default App;
