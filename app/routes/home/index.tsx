import React from "react";

type HomeRouteProps = {
  title: string;
};

export default function HomeRoute({ title }: HomeRouteProps) {
  return <div>{title}</div>;
}
