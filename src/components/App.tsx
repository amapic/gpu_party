import  { lazy, Suspense } from "react";
// import Screen2 from "./Screen2.tsx";
import { Hero } from "./Hero";
import Menu from "./Menu";
const Screen2 = lazy(() => import("./Screen2"));
// import { Screen3} from "./Screen345";
const Screen3 = lazy(() => import("./Screen345").then((module) => ({ default: module.Screen3 })));
const Screen4 = lazy(() => import("./Screen345").then((module) => ({ default: module.Screen4 })));
const Screen5 = lazy(() => import("./Screen345").then((module) => ({ default: module.Screen5 })));
import Interstitial from "./Interstitial";


// import { Scene } from "@/components/Scene";
import { useRef, useState, useEffect } from "react";
// const AppHero = memo(Hero);
import { WaitingScreen } from "./WaitingScreen";

import "../styles/index.css";

// Lazy load Screen6
const Screen6 = lazy(() => import("./Screen6"));


function App() {
  const paramScene = useRef<number>(0);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [animateCanvas1, setAnimateCanvas1] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`content`}>
      {/* <WaitingScreen setSceneLoaded={setSceneLoaded}/> */}
      {!sceneLoaded && <WaitingScreen setSceneLoaded={setSceneLoaded} />}
      {/* <Scene param={paramScene} setSceneLoaded={setSceneLoaded} animateCanvas1={animateCanvas1} /> */}
      <Menu />
      {sceneLoaded && <Hero />}
      {sceneLoaded && (
        <>
          <Screen2 />
          <Screen3 />
          <Interstitial />
          <Suspense fallback={<div>Loading...</div>}>
            <>
              <Screen4 />
              <Screen5 />
            </>
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <Screen6 setAnimateCanvas1={setAnimateCanvas1} />
          </Suspense>
        </>
      )}
    </div>
  );
}

export default App;
