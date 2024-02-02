import {
  DiscordButton
} from "/build/_shared/chunk-QPY57N7U.js";
import {
  require_page
} from "/build/_shared/chunk-A2L3DPIP.js";
import {
  Markdown
} from "/build/_shared/chunk-PH6KTJR6.js";
import "/build/_shared/chunk-BQSA676N.js";
import "/build/_shared/chunk-7GNGWBYG.js";
import "/build/_shared/chunk-2QJY4JOV.js";
import {
  require_node
} from "/build/_shared/chunk-NBEH4DGX.js";
import "/build/_shared/chunk-MLG4T7FR.js";
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
import "/build/_shared/chunk-2ZEF6LYD.js";
import "/build/_shared/chunk-RX5LCL75.js";
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

// app/routes/about.tsx
var import_node = __toESM(require_node(), 1);
var import_page = __toESM(require_page(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/about.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/about.tsx"
  );
  import.meta.hot.lastModified = "1706336189924.0906";
}
var meta = metaFn;
function About() {
  _s();
  const {
    content
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, { className: "flex flex-col", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl mb-4", children: "About CS" }, void 0, false, {
      fileName: "app/routes/about.tsx",
      lineNumber: 42,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg", children: [
      "Hi, I'm Christopher A. Sesugh, I'm a software engineer and an educator. I help craft exceptional software solutions for tomorrow's challenges. I am also the founder of",
      " ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "https://casbytes.com", children: "casbytes.com" }, void 0, false, {
        fileName: "app/routes/about.tsx",
        lineNumber: 47,
        columnNumber: 9
      }, this),
      ", an online school for software engineers."
    ] }, void 0, true, {
      fileName: "app/routes/about.tsx",
      lineNumber: 43,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "py-4 self-start", children: "You can find my social media handles in the footer of my website." }, void 0, false, {
      fileName: "app/routes/about.tsx",
      lineNumber: 50,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "dark:text-slate-300 text-slate-600", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Markdown, { source: content }, void 0, false, {
      fileName: "app/routes/about.tsx",
      lineNumber: 54,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/about.tsx",
      lineNumber: 53,
      columnNumber: 7
    }, this),
    " ",
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DiscordButton, {}, void 0, false, {
      fileName: "app/routes/about.tsx",
      lineNumber: 56,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/about.tsx",
    lineNumber: 41,
    columnNumber: 10
  }, this);
}
_s(About, "t8fJA4Kz9OOMVddc0s1pdl7daiI=", false, function() {
  return [useLoaderData];
});
_c = About;
var _c;
$RefreshReg$(_c, "About");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  About as default,
  meta
};
//# sourceMappingURL=/build/routes/about-335MLLW4.js.map
