import React from 'react';

import Screen2 from "./Screen2";
// import Menu from "@/components/Menu";
import { Hero } from "./Hero";
import  Menu  from "./Menu";
import { Screen3, Screen4, Screen5 } from './Screen345';
import Interstitial from "./Interstitial";
// import { Scene } from "@/components/Scene";
// import { Prompt } from "next/font/google";
import Screen6 from "./Screen6";  
// import Interstitial from "@/components/Interstitial";
// import CustomGeometryParticles from "@/components/Particle";
import { useRef, useState, useEffect, memo, useMemo } from "react";
// const AppHero = memo(Hero);
// import { WaitingScreen } from "@/components/waitingScreen";
// import { DomUtils } from "@/utils/utils";


import '../styles/index.css';
import Screen2 from './Screen2';
import { Screen3, Screen4, Screen5 } from './Screen345';



function App() {
  const paramScene = useRef<number>(0);
  const [sceneLoaded, setSceneLoaded] = useState(true);
  const [animateCanvas1, setAnimateCanvas1] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // DomUtils.enableScroll();

  }, []);

  // DomUtils

  return (
    <div className={`content`}>
      {/* <WaitingScreen setSceneLoaded={setSceneLoaded}/> */}
      {/* {!sceneLoaded && <WaitingScreen setSceneLoaded={setSceneLoaded} />} */}
      {/* <Scene param={paramScene} setSceneLoaded={setSceneLoaded} animateCanvas1={animateCanvas1} /> */}
      {/* <CustomGeometryParticles  /> */}
      {/* {sceneLoaded && <Menu /> } */}
      <Menu />
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