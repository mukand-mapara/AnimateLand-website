import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const totalVideos = 4;
  const nextVideoRef = useRef(null);

  const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

  const handleMiniVideoClick = () => {
    setHasClicked(true);
    setCurrentIndex(upcomingVideoIndex);
  };

  const getVideoSrc = (index) => `/videos/hero-${index}.mp4`;
  const getPosterSrc = (index) => `/images/hero-${index}.jpg`; // Optional poster

  useEffect(() => {
    // Remove loading after initial video is ready
    const timer = setTimeout(() => setIsLoading(false), 1000); // fallback timeout
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    if (hasClicked) {
      gsap.set("#next-video", { visibility: "visible" });
      gsap.to("#next-video", {
        scale: 1,
        width: "100%",
        height: "100%",
        duration: 1,
        ease: "power1.inOut",
        onStart: () => nextVideoRef.current?.play(),
      });
      gsap.from("#current-video", {
        scale: 0,
        duration: 1.5,
        ease: "power1.inOut",
      });
    }
  }, { dependencies: [currentIndex], revertOnUpdate: true });

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
      borderRadius: "0 0 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  }, []);

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-y-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          {/* Mini Preview Video */}
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <div
              onClick={handleMiniVideoClick}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                ref={nextVideoRef}
                src={getVideoSrc(upcomingVideoIndex)}
                id="current-video"
                loop
                muted
                playsInline
                loading="lazy"
                preload="none"
                poster={getPosterSrc(upcomingVideoIndex)}
                className="size-64 origin-center scale-150 object-cover object-center"
              />
            </div>
          </div>

          {/* Modal for Trailer */}
          {showModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80">
              <div className="relative w-full max-w-4xl p-4">
                <button
                  className="absolute top-2 right-2 text-white text-xl"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
                <video
                  src={getVideoSrc(currentIndex)}
                  autoPlay
                  loop
                  controls
                  poster={getPosterSrc(currentIndex)}
                  className="w-full h-auto max-h-[80vh] rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          {/* Main Video */}
          <video
            src={getVideoSrc(currentIndex)}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={getPosterSrc(currentIndex)}
            className="absolute left-0 top-0 size-full object-cover object-center"
          />
        </div>

        {/* Headings & CTA */}
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          G<b>a</b>ming
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              redefi<b>n</b>e
            </h1>
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>
            <Button
              id="watch-trailer"
              title="Watch Trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="!bg-yellow-300 flex-center gap-1"
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Fallback Heading for Legacy */}
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        G<b>a</b>ming
      </h1>
    </div>
  );
};

export default Hero;
