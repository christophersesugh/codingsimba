import React from "react";
import { Header } from "~/components/page-header.client";
import { Mission } from "./components/mission";
import { Impact } from "./components/impact";
import { Values } from "./components/values";
import { Journey } from "./components/journey";
import { Skills } from "./components/skills";
import { CTA } from "./components/cta";

export default function AboutRoute() {
  return (
    <>
      <Header
        title="Simba's Den of Nerdery"
        description="Passionate about coding, teaching, and building tools that make a difference."
      />
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <Mission />
        <Journey />
        <Impact />
        <Skills />
        <Values />
        <CTA />
      </div>
    </>
  );
}
