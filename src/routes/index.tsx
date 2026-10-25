import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FlorivaMainPage } from "@/components/FlorivaMainPage";
import { OnboardingScreen } from "@/components/OnboardingScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NASTARIN GULLARI — Do'stlik shaharida gul va sovg'alar yetkazib berish" },
      {
        name: "description",
        content:
          "Do'stlik shaharida mualliflik guldastalari, atirgullar va sovg'a to'plamlari. 24/7 bepul va tezkor yetkazib berish.",
      },
      { property: "og:title", content: "NASTARIN GULLARI - Premium gul do'koni" },
      {
        property: "og:description",
        content: "Yaqinlaringizga mehr va quvonch ulashuvchi mualliflik guldastalari.",
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (showOnboarding) {
    return (
      <OnboardingScreen
        onGetStarted={() => setShowOnboarding(false)}
        onSignIn={() => setShowOnboarding(false)}
      />
    );
  }

  return <FlorivaMainPage onOpenOnboarding={() => setShowOnboarding(true)} />;
}
