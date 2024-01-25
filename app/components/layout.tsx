import { Outlet } from "@remix-run/react";
// import * as mathjax from "better-react-mathjax";
import { Navbar } from "./nav-bar";
import { Footer } from "./footer";
// import { config } from "~/libs/mathjax";

// const { MathJax } = mathjax;

export function RootLayout() {
  return (
    <>
      <Navbar />
      {/* <MathJaxContext version={3} config={config}> */}
      {/* <MathJax> */}
      <Outlet />
      {/* </MathJax> */}
      {/* </MathJaxContext> */}
      <Footer />
    </>
  );
}
