import React from "react";
import { useNavigate } from "@tanstack/react-router";

interface OnboardingScreenProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

export function OnboardingScreen({ onGetStarted, onSignIn }: OnboardingScreenProps) {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigate({ to: "/catalog" });
    }
  };

  const handleSignInClick = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      navigate({ to: "/auth" });
    }
  };

  return (
    <div
      className="min-h-screen min-h-[100dvh] w-full flex flex-col justify-between items-center overflow-x-hidden relative select-none"
      style={{
        background:
          "linear-gradient(180deg, rgb(252,245,245) 6.0%, rgb(253,241,242) 10.7%, rgb(253,241,242) 15.5%, rgb(255,243,247) 20.2%, rgb(255,253,254) 25.0%, rgb(232,223,224) 29.8%, rgb(255,250,253) 34.5%, rgb(254,245,246) 39.3%, rgb(253,244,245) 44.0%, rgb(253,232,237) 48.8%, rgb(251,227,233) 53.6%, rgb(253,232,237) 58.3%, rgb(253,234,238) 63.1%, rgb(255,236,240) 67.9%, rgb(251,240,241) 72.6%, rgb(254,242,244) 77.4%, rgb(254,245,248) 82.1%, rgb(254,249,250) 86.9%, rgb(255,250,252) 91.7%)",
      }}
    >
      <div className="w-full max-w-[414px] mx-auto flex-1 flex flex-col justify-between items-center pt-2 sm:pt-4 pb-6 sm:pb-8">
        {/* Bouquet Section: fills width, close-up, with exact speech bubbles */}
        <div className="relative w-full max-w-[386px] h-[330px] sm:h-[370px] flex items-center justify-center overflow-hidden">
          <img
            src="/images/onboarding-flowers.jpg"
            alt="Nastarin Gullari"
            className="w-full h-full object-cover pointer-events-none select-none"
            style={{
              WebkitMaskImage:
                "linear-gradient(transparent, #000 14%, #000 86%, transparent)",
              maskImage:
                "linear-gradient(transparent, #000 14%, #000 86%, transparent)",
            }}
          />

          {/* Floating Bubble 1: "Wishing you a day as special as you are!" */}
          <div
            className="absolute pointer-events-none bg-white rounded-[10px] flex items-center justify-center text-center text-[#222]"
            style={{
              right: "32px",
              top: "56%",
              width: "142px",
              height: "43px",
              boxShadow: "0 3px 10px rgba(120,60,80,0.08)",
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontStyle: "italic",
              fontSize: "13px",
              lineHeight: "15px",
            }}
          >
            <span>
              Wishing you a day as
              <br />
              special as you are!
            </span>
          </div>

          {/* Floating Bubble 2: "✿ Premium flowers" */}
          <div
            className="absolute pointer-events-none bg-white rounded-[10px] flex items-center justify-center gap-1.5 text-center text-[#222]"
            style={{
              right: "44px",
              top: "71%",
              width: "117px",
              height: "34px",
              boxShadow: "0 3px 10px rgba(120,60,80,0.08)",
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontStyle: "italic",
              fontSize: "12px",
              lineHeight: "14px",
            }}
          >
            <i
              style={{
                fontStyle: "normal",
                color: "#ee4b6a",
                fontSize: "10px",
              }}
            >
              ✿
            </i>
            <span>Premium flowers</span>
          </div>
        </div>

        {/* Bottom Area: Welcome typography, Dots, Action button, Sign In */}
        <div className="w-full flex flex-col items-center px-4">
          {/* Title */}
          <h1
            className="text-center font-bold text-[28px] sm:text-[30px] leading-[38px] sm:leading-[40px] tracking-[-1px] text-[#17171c]"
            style={{
              fontFamily:
                "-apple-system, 'SF Pro Display', Inter, system-ui, sans-serif",
            }}
          >
            Welcome to Nastarin
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-center text-[13px] sm:text-[14px] leading-[18px] text-[#8d8d92] whitespace-nowrap">
            Send a gift with a heartfelt message to create a truly
            <br />
            unique customize gift
          </p>

          {/* Pagination Dots (Active Pink Pill + 2 Dots) */}
          <div className="mt-4 sm:mt-5 flex items-center justify-center gap-[5px]">
            <div className="w-[21px] h-[6px] rounded-[3px] bg-[#ee4b6a]" />
            <div className="w-[6px] h-[6px] rounded-[3px] bg-[#f3cdd4]" />
            <div className="w-[6px] h-[6px] rounded-[3px] bg-[#f1dcc0]" />
          </div>

          {/* Primary CTA Button: "Get Started" */}
          <button
            onClick={handleGetStartedClick}
            className="mt-5 sm:mt-6 w-full max-w-[354px] h-[49px] rounded-[25px] text-white font-semibold text-[17px] active:scale-[0.98] transition-transform duration-150 cursor-pointer flex items-center justify-center"
            style={{
              background: "linear-gradient(90deg, #f04b6e, #e8466a)",
              fontFamily: "-apple-system, 'SF Pro Text', Inter, sans-serif",
              boxShadow: "0 8px 24px rgba(240,75,110,0.35)",
            }}
          >
            Get Started
          </button>

          {/* Footer Link: "Already have an account? Sign In" */}
          <div className="mt-3.5 sm:mt-4 text-center text-[14px] leading-[20px] text-[#17171c]">
            Already have an account?{" "}
            <button
              onClick={handleSignInClick}
              className="inline p-0 m-0 border-0 bg-transparent text-[#ee4b6a] font-semibold cursor-pointer hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
