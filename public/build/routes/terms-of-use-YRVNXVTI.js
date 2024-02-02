import {
  require_page
} from "/build/_shared/chunk-A2L3DPIP.js";
import {
  Markdown
} from "/build/_shared/chunk-PH6KTJR6.js";
import "/build/_shared/chunk-BQSA676N.js";
import "/build/_shared/chunk-7GNGWBYG.js";
import "/build/_shared/chunk-2QJY4JOV.js";
import "/build/_shared/chunk-MLG4T7FR.js";
import {
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

// app/routes/terms-of-use.tsx
var import_page = __toESM(require_page(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/terms-of-use.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/terms-of-use.tsx"
  );
  import.meta.hot.lastModified = "1706197824014.4092";
}
var meta = metaFn;
function TermsOfUse() {
  _s();
  const {
    content
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, { className: "max-w-3xl flex flex-col items-center", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-2xl text-slate-800 dark:text-slate-100 my-6 underline underline-offset-4", children: "Terms of use" }, void 0, false, {
      fileName: "app/routes/terms-of-use.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "dark:text-slate-300 text-slate-600", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Markdown, { source: content }, void 0, false, {
      fileName: "app/routes/terms-of-use.tsx",
      lineNumber: 45,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/terms-of-use.tsx",
      lineNumber: 44,
      columnNumber: 7
    }, this),
    " "
  ] }, void 0, true, {
    fileName: "app/routes/terms-of-use.tsx",
    lineNumber: 40,
    columnNumber: 10
  }, this);
}
_s(TermsOfUse, "t8fJA4Kz9OOMVddc0s1pdl7daiI=", false, function() {
  return [useLoaderData];
});
_c = TermsOfUse;
var _c;
$RefreshReg$(_c, "TermsOfUse");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  TermsOfUse as default,
  meta
};
//# sourceMappingURL=/build/routes/terms-of-use-YRVNXVTI.js.map
