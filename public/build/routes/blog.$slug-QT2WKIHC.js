import {
  Markdown
} from "/build/_shared/chunk-PH6KTJR6.js";
import "/build/_shared/chunk-BQSA676N.js";
import "/build/_shared/chunk-7GNGWBYG.js";
import "/build/_shared/chunk-2QJY4JOV.js";
import {
  BlogCard,
  EmptyContentUI,
  F,
  require_blog,
  require_moment
} from "/build/_shared/chunk-HRGXIZDH.js";
import "/build/_shared/chunk-TYKTURUQ.js";
import {
  require_node
} from "/build/_shared/chunk-NBEH4DGX.js";
import {
  Button
} from "/build/_shared/chunk-MLG4T7FR.js";
import {
  Link2 as Link,
  useLoaderData
} from "/build/_shared/chunk-A2SLOCV3.js";
import "/build/_shared/chunk-WEAPBHQG.js";
import "/build/_shared/chunk-QAJVZFIO.js";
import {
  Container
} from "/build/_shared/chunk-3QLU3XWV.js";
import {
  metaFn
} from "/build/_shared/chunk-IQWGNDUA.js";
import "/build/_shared/chunk-2DLHY7YA.js";
import {
  GenIcon
} from "/build/_shared/chunk-2ZEF6LYD.js";
import {
  clsx_default,
  cn
} from "/build/_shared/chunk-RX5LCL75.js";
import {
  createHotContext
} from "/build/_shared/chunk-6IOYNRT4.js";
import "/build/_shared/chunk-JR22VO6P.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-7PHB3BFD.js";
import "/build/_shared/chunk-CJ4MY3PQ.js";
import {
  __toESM
} from "/build/_shared/chunk-PZDJHGND.js";

// app/routes/blog.$slug.tsx
var import_node = __toESM(require_node(), 1);

// app/components/content-container.tsx
var import_moment = __toESM(require_moment(), 1);

// node_modules/react-icons/ai/index.mjs
function AiOutlineArrowLeft(props) {
  return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 1024 1024" }, "child": [{ "tag": "path", "attr": { "d": "M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 0 0 0 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" }, "child": [] }] })(props);
}

// app/components/back-button.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/back-button.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/back-button.tsx"
  );
  import.meta.hot.lastModified = "1706200943621.8452";
}
function BackButton({
  to,
  text,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "ghost", className: clsx_default("flex items-center self-start text-lg font-extrabold capitalize", className), children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AiOutlineArrowLeft, { className: "mr-2 inline" }, void 0, false, {
      fileName: "app/components/back-button.tsx",
      lineNumber: 32,
      columnNumber: 9
    }, this),
    text
  ] }, void 0, true, {
    fileName: "app/components/back-button.tsx",
    lineNumber: 31,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/back-button.tsx",
    lineNumber: 30,
    columnNumber: 10
  }, this);
}
_c = BackButton;
var _c;
$RefreshReg$(_c, "BackButton");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/iframe.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/iframe.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/iframe.tsx"
  );
  import.meta.hot.lastModified = "1706913233228.5076";
}
function Iframe({
  src,
  title,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("iframe", { className: cn("mx-auto w-full h-64 md:h-[28rem] lg:h-128 max-h-[32rem] rounded-md my-12", className), src: `https://www.youtube.com/embed/${src}`, title, allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share", allowFullScreen: true }, void 0, false, {
    fileName: "app/components/iframe.tsx",
    lineNumber: 27,
    columnNumber: 10
  }, this);
}
_c2 = Iframe;
var _c2;
$RefreshReg$(_c2, "Iframe");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/content-container.tsx
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/content-container.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/content-container.tsx"
  );
  import.meta.hot.lastModified = "1706339778579.1167";
}
function ContentContainer({
  to,
  text,
  post
}) {
  const {
    data,
    content
  } = post;
  const stats = F(content);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Container, { className: "max-w-3xl md:px-0 flex flex-col gap-8", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(BackButton, { to, text, className: "pl-0 mb-4" }, void 0, false, {
      fileName: "app/components/content-container.tsx",
      lineNumber: 38,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h1", { className: "text-3xl capitalize mb-4", children: data.title }, void 0, false, {
        fileName: "app/components/content-container.tsx",
        lineNumber: 40,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { className: "text-slate-500 dark:text-slate-400 text-lg", children: [
        (0, import_moment.default)(data.createdAt).format("MMM DD, YYYY"),
        " ~ ",
        stats.text
      ] }, void 0, true, {
        fileName: "app/components/content-container.tsx",
        lineNumber: 41,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/content-container.tsx",
      lineNumber: 39,
      columnNumber: 7
    }, this),
    data.photo ? /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("img", { src: data.photo, alt: data.title, title: data.title, className: "w-full rounded-md h-[16rem] md:h-[28rem]" }, void 0, false, {
      fileName: "app/components/content-container.tsx",
      lineNumber: 45,
      columnNumber: 21
    }, this) : null,
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h2", { className: "text-lg text-slate-600 dark:text-slate-300 p-4 mt-8 border-l-8 rounded-md border-blue-500 dark:bg-slate-700 bg-slate-200 ", children: data.description }, void 0, false, {
      fileName: "app/components/content-container.tsx",
      lineNumber: 46,
      columnNumber: 7
    }, this),
    data.video ? /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Iframe, { src: data.video, title: data.title }, void 0, false, {
      fileName: "app/components/content-container.tsx",
      lineNumber: 50,
      columnNumber: 21
    }, this) : null,
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "dark:text-slate-300 text-slate-800 markdown", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Markdown, { source: content }, void 0, false, {
      fileName: "app/components/content-container.tsx",
      lineNumber: 52,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/components/content-container.tsx",
      lineNumber: 51,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/content-container.tsx",
    lineNumber: 37,
    columnNumber: 10
  }, this);
}
_c3 = ContentContainer;
var _c3;
$RefreshReg$(_c3, "ContentContainer");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/blog.$slug.tsx
var import_blog = __toESM(require_blog(), 1);
var import_jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/blog.$slug.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/blog.$slug.tsx"
  );
  import.meta.hot.lastModified = "1706201266481.9993";
}
var meta = metaFn;
function BlogPostRoute() {
  _s();
  const {
    relatedPosts,
    post
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "max-w-3xl md:px-0 mx-auto", children: [
    post ? /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(ContentContainer, { to: "/blog", text: "back to overview", post }, void 0, false, {
      fileName: "app/routes/blog.$slug.tsx",
      lineNumber: 45,
      columnNumber: 15
    }, this) : !post ? /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(EmptyContentUI, { message: "no post found with given slug." }, void 0, false, {
      fileName: "app/routes/blog.$slug.tsx",
      lineNumber: 45,
      columnNumber: 93
    }, this) : null,
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("hr", {}, void 0, false, {
      fileName: "app/routes/blog.$slug.tsx",
      lineNumber: 47,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex flex-col gap-6 mt-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h2", { className: "text-2xl font-bold px-4", children: "Related articles:" }, void 0, false, {
        fileName: "app/routes/blog.$slug.tsx",
        lineNumber: 49,
        columnNumber: 9
      }, this),
      relatedPosts?.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-20 justify-between mb-12", children: relatedPosts.map((post2, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(BlogCard, { post: post2 }, `${post2.data.slug}-${index}`, false, {
        fileName: "app/routes/blog.$slug.tsx",
        lineNumber: 51,
        columnNumber: 48
      }, this)) }, void 0, false, {
        fileName: "app/routes/blog.$slug.tsx",
        lineNumber: 50,
        columnNumber: 33
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(EmptyContentUI, { message: "no related posts for this post.", className: "!text-xl !-mt-4" }, void 0, false, {
        fileName: "app/routes/blog.$slug.tsx",
        lineNumber: 52,
        columnNumber: 20
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/blog.$slug.tsx",
      lineNumber: 48,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/blog.$slug.tsx",
    lineNumber: 44,
    columnNumber: 10
  }, this);
}
_s(BlogPostRoute, "7Nbfh8NRO1rGyJ4a9+l3mwmpS6o=", false, function() {
  return [useLoaderData];
});
_c4 = BlogPostRoute;
var _c4;
$RefreshReg$(_c4, "BlogPostRoute");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  BlogPostRoute as default,
  meta
};
//# sourceMappingURL=/build/routes/blog.$slug-QT2WKIHC.js.map
