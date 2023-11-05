import React from "react";
import { Section } from "./section";
import { useNavigate, useNavigation } from "@remix-run/react";

export function ErrorUI({ error }: { error: unknown | Error }) {
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";
  return (
    <Section>
      <div className="max-w-md border mx-auto  flex flex-col items-center rounded-md mt-8 mb-16 p-4 ">
        <h1 className="text-[5rem]">Error!</h1>
        <p className="text-[2rem]">An error occured.</p>
        <p className="text-lg text-red-500">
          {error instanceof Error ? error.message : "Unknown error."}
        </p>
        <button
          onClick={() => navigate(0)}
          className="rounded-md border-2 p-2 mt-4 uppercase"
        >
          {isLoading ? "retrying..." : "retry"}
        </button>
      </div>
    </Section>
  );
}
