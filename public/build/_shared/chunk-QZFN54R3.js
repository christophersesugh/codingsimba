import {
  FiAlertCircle
} from "/build/_shared/chunk-TYKTURUQ.js";
import {
  cn
} from "/build/_shared/chunk-RX5LCL75.js";
import {
  createHotContext
} from "/build/_shared/chunk-6IOYNRT4.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-7PHB3BFD.js";
import {
  __toESM
} from "/build/_shared/chunk-PZDJHGND.js";

// app/components/content-error-ui.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/content-error-ui.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/content-error-ui.tsx"
  );
  import.meta.hot.lastModified = "1706341610554.323";
}
function ContentErrorUI({
  error,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-3xl bg-red-100 rounded-md mx-auto p-6 my-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: cn("text-4xl capitalize font-black py-8 flex flex-col gap-6 items-center justify-center", className), children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FiAlertCircle, { className: cn("inline mr-2 text-[7rem] text-red-400", className) }, void 0, false, {
      fileName: "app/components/content-error-ui.tsx",
      lineNumber: 29,
      columnNumber: 9
    }, this),
    " ",
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-red-500", children: "Error!" }, void 0, false, {
      fileName: "app/components/content-error-ui.tsx",
      lineNumber: 30,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-red-500 text-lg", children: error && error.message ? error.message : "Unknown error." }, void 0, false, {
      fileName: "app/components/content-error-ui.tsx",
      lineNumber: 31,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/content-error-ui.tsx",
    lineNumber: 28,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/content-error-ui.tsx",
    lineNumber: 27,
    columnNumber: 10
  }, this);
}
_c = ContentErrorUI;
var _c;
$RefreshReg$(_c, "ContentErrorUI");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  ContentErrorUI
};
//# sourceMappingURL=/build/_shared/chunk-QZFN54R3.js.map
