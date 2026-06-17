"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once. ScrollTrigger drives the cinematic reveals; useGSAP gives us
// automatic cleanup (reverts tweens + kills triggers on unmount).
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
