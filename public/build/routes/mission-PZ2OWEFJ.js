import {
  require_page
} from "/build/_shared/chunk-A2L3DPIP.js";
import {
  Markdown
} from "/build/_shared/chunk-PH6KTJR6.js";
import "/build/_shared/chunk-BQSA676N.js";
import {
  BsArrowRight
} from "/build/_shared/chunk-7GNGWBYG.js";
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

// app/routes/mission.tsx
var import_node = __toESM(require_node(), 1);
var import_page = __toESM(require_page(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/mission.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/mission.tsx"
  );
  import.meta.hot.lastModified = "1706197917242.5479";
}
var meta = metaFn;
function Mission() {
  _s();
  const {
    content
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, { className: "flex flex-col items-center", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl text-slate-800 dark:text-slate-100 mb-8 underline underline-offset-4", children: "My Mission" }, void 0, false, {
      fileName: "app/routes/mission.tsx",
      lineNumber: 42,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "dark:text-slate-300 text-slate-600", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Markdown, { source: content }, void 0, false, {
      fileName: "app/routes/mission.tsx",
      lineNumber: 46,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/mission.tsx",
      lineNumber: 45,
      columnNumber: 7
    }, this),
    " ",
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/about", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "rounded-xl  text-xl p-4 my-8 border-2 border-slate-400 hover:border-slate-800 dark:hover:border-[#fff] flex items-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BsArrowRight, { className: "text-xl inline animate-pulse mr-4", "aria-label": "learn more about CS" }, void 0, false, {
        fileName: "app/routes/mission.tsx",
        lineNumber: 50,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Learn more about Me." }, void 0, false, {
        fileName: "app/routes/mission.tsx",
        lineNumber: 51,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/mission.tsx",
      lineNumber: 49,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/mission.tsx",
      lineNumber: 48,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/mission.tsx",
    lineNumber: 41,
    columnNumber: 10
  }, this);
}
_s(Mission, "t8fJA4Kz9OOMVddc0s1pdl7daiI=", false, function() {
  return [useLoaderData];
});
_c = Mission;
var _c;
$RefreshReg$(_c, "Mission");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Mission as default,
  meta
};
//# sourceMappingURL=/build/routes/mission-PZ2OWEFJ.js.map
