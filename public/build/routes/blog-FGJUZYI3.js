import {
  ContentErrorUI
} from "/build/_shared/chunk-QZFN54R3.js";
import "/build/_shared/chunk-TYKTURUQ.js";
import {
  Outlet,
  useRouteError
} from "/build/_shared/chunk-A2SLOCV3.js";
import "/build/_shared/chunk-WEAPBHQG.js";
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

// app/routes/blog.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/blog.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/blog.tsx"
  );
  import.meta.hot.lastModified = "1706195526860.7988";
}
function BlogRoute() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
    fileName: "app/routes/blog.tsx",
    lineNumber: 25,
    columnNumber: 10
  }, this);
}
_c = BlogRoute;
function ErrorBoundary() {
  _s();
  const error = useRouteError();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ContentErrorUI, { error }, void 0, false, {
    fileName: "app/routes/blog.tsx",
    lineNumber: 31,
    columnNumber: 10
  }, this);
}
_s(ErrorBoundary, "oAgjgbJzsRXlB89+MoVumxMQqKM=", false, function() {
  return [useRouteError];
});
_c2 = ErrorBoundary;
var _c;
var _c2;
$RefreshReg$(_c, "BlogRoute");
$RefreshReg$(_c2, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  BlogRoute as default
};
//# sourceMappingURL=/build/routes/blog-FGJUZYI3.js.map
