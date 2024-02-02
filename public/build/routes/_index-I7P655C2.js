import {
  HeaderButton,
  PageHeader
} from "/build/_shared/chunk-EDTLRGZJ.js";
import {
  ContentErrorUI
} from "/build/_shared/chunk-QZFN54R3.js";
import {
  FaSpinner
} from "/build/_shared/chunk-MQIHVSNL.js";
import "/build/_shared/chunk-OXGF3ABJ.js";
import {
  BsArrowRight
} from "/build/_shared/chunk-7GNGWBYG.js";
import "/build/_shared/chunk-2QJY4JOV.js";
import {
  BlogCard,
  EmptyContentUI,
  require_blog
} from "/build/_shared/chunk-HRGXIZDH.js";
import "/build/_shared/chunk-TYKTURUQ.js";
import "/build/_shared/chunk-MLG4T7FR.js";
import {
  Link2 as Link,
  useLoaderData
} from "/build/_shared/chunk-A2SLOCV3.js";
import "/build/_shared/chunk-WEAPBHQG.js";
import {
  Container
} from "/build/_shared/chunk-3QLU3XWV.js";
import {
  home_default
} from "/build/_shared/chunk-2DLHY7YA.js";
import "/build/_shared/chunk-2ZEF6LYD.js";
import "/build/_shared/chunk-RX5LCL75.js";
import {
  createHotContext
} from "/build/_shared/chunk-6IOYNRT4.js";
import "/build/_shared/chunk-JR22VO6P.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-7PHB3BFD.js";
import {
  require_react
} from "/build/_shared/chunk-CJ4MY3PQ.js";
import {
  __toESM
} from "/build/_shared/chunk-PZDJHGND.js";

// app/routes/_index.tsx
var import_react2 = __toESM(require_react(), 1);

// app/components/home/header.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/home/header.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/home/header.tsx"
  );
  import.meta.hot.lastModified = "1706195407401.19";
}
function HomeHeader() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, { title: "Crafting exceptional software solutions for tomorrow's challenges.", headerImage: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: home_default, alt: "dsa", width: 300, height: 300, className: "self-start rounded-xl w-full mx-auto md:w-[80%]" }, void 0, false, {
    fileName: "app/components/home/header.tsx",
    lineNumber: 26,
    columnNumber: 110
  }, this), children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex gap-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/blog", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "capitalize rounded-md bg-[#1f2028] text-[#fff] dark:bg-[#fff] dark:text-[#1f2028] text-lg p-2 mt-6", children: "read the blog" }, void 0, false, {
      fileName: "app/components/home/header.tsx",
      lineNumber: 30,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/components/home/header.tsx",
      lineNumber: 29,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/components/home/header.tsx",
      lineNumber: 28,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeaderButton, { to: "/#about", buttonText: "Learn more about CS." }, void 0, false, {
      fileName: "app/components/home/header.tsx",
      lineNumber: 35,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/home/header.tsx",
    lineNumber: 27,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/home/header.tsx",
    lineNumber: 26,
    columnNumber: 10
  }, this);
}
_c = HomeHeader;
var _c;
$RefreshReg$(_c, "HomeHeader");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/assets/avatar.jpeg
var avatar_default = "/build/_assets/avatar-VX4XOT6Z.jpeg";

// app/components/home/about.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/home/about.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/home/about.tsx"
  );
  import.meta.hot.lastModified = "1706194982003.0176";
}
function About() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("section", { id: "about", className: "px-6 flex flex-col justify-center items-center gap-12 md:flex-row max-w-5xl mx-auto mt-32 md:my-20 mb-12 pt-12", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("img", { src: avatar_default, width: 200, height: 200, alt: "Coding Simba", className: "md:self-start rounded-full md:mx-14 h-[200px] w-[200px]" }, void 0, false, {
      fileName: "app/components/home/about.tsx",
      lineNumber: 26,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "max-w-xl", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h2", { className: "text-3xl", children: "Hi, I am Christopher Aondona Sesugh [Coding Simba]. I am a software engineer and a teacher. I love building quality software and sharing my existing knowledge across the globe." }, void 0, false, {
        fileName: "app/components/home/about.tsx",
        lineNumber: 28,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h3", { className: "text-2xl text-slate-400 mt-8", children: "I am also an athlete and love exercising in the gym or working out at home." }, void 0, false, {
        fileName: "app/components/home/about.tsx",
        lineNumber: 33,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(HeaderButton, { to: "/about", icon: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(BsArrowRight, { className: "text-lg animate-pulse" }, void 0, false, {
        fileName: "app/components/home/about.tsx",
        lineNumber: 37,
        columnNumber: 41
      }, this), buttonText: "Learn more about Me." }, void 0, false, {
        fileName: "app/components/home/about.tsx",
        lineNumber: 37,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/home/about.tsx",
      lineNumber: 27,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/home/about.tsx",
    lineNumber: 25,
    columnNumber: 10
  }, this);
}
_c2 = About;
var _c2;
$RefreshReg$(_c2, "About");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/home/recent-posts.tsx
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/home/recent-posts.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/home/recent-posts.tsx"
  );
  import.meta.hot.lastModified = "1706341443593.8018";
}
function RecentPosts({
  loaderData
}) {
  const {
    posts,
    error
  } = loaderData;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Container, { className: "md:max-w-4xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "flex flex-col gap-6 mt-12", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h2", { className: "text-2xl font-bold", children: "Recent posts" }, void 0, false, {
      fileName: "app/components/home/recent-posts.tsx",
      lineNumber: 34,
      columnNumber: 9
    }, this),
    error ? /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(ContentErrorUI, { error }, void 0, false, {
      fileName: "app/components/home/recent-posts.tsx",
      lineNumber: 35,
      columnNumber: 18
    }, this) : posts?.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-20 justify-evenly mb-12", children: posts.length && posts.map((post, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(BlogCard, { post }, `${post.data.slug}-${index}`, false, {
      fileName: "app/components/home/recent-posts.tsx",
      lineNumber: 36,
      columnNumber: 57
    }, this)) }, void 0, false, {
      fileName: "app/components/home/recent-posts.tsx",
      lineNumber: 35,
      columnNumber: 69
    }, this) : !posts?.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(EmptyContentUI, { message: "no recent posts found.", className: "!text-2xl !-mt-4" }, void 0, false, {
      fileName: "app/components/home/recent-posts.tsx",
      lineNumber: 37,
      columnNumber: 37
    }, this) : null
  ] }, void 0, true, {
    fileName: "app/components/home/recent-posts.tsx",
    lineNumber: 33,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/home/recent-posts.tsx",
    lineNumber: 32,
    columnNumber: 10
  }, this);
}
_c3 = RecentPosts;
var _c3;
$RefreshReg$(_c3, "RecentPosts");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/home/index.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/home/index.ts"
  );
  import.meta.hot.lastModified = "1706197380544.8093";
}

// app/routes/_index.tsx
var import_blog = __toESM(require_blog(), 1);
var import_jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_index.tsx"
  );
  import.meta.hot.lastModified = "1706340551856.7422";
}
function Index() {
  _s();
  const loaderData = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_jsx_dev_runtime4.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(HomeHeader, {}, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 46,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(About, {}, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 47,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_react2.default.Suspense, { fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "w-full max-3xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(FaSpinner, { className: "animate-spin text-3xl mx-auto" }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 49,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 48,
      columnNumber: 33
    }, this), children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(RecentPosts, { loaderData }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 51,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 48,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 45,
    columnNumber: 10
  }, this);
}
_s(Index, "ceKF1Gd7W4lGV+M78eBsU+KQIkw=", false, function() {
  return [useLoaderData];
});
_c4 = Index;
var _c4;
$RefreshReg$(_c4, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default
};
//# sourceMappingURL=/build/routes/_index-I7P655C2.js.map
