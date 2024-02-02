import {
  Fade
} from "/build/_shared/chunk-OXGF3ABJ.js";
import {
  BsArrowDown
} from "/build/_shared/chunk-7GNGWBYG.js";
import {
  Button
} from "/build/_shared/chunk-MLG4T7FR.js";
import {
  Link2 as Link
} from "/build/_shared/chunk-A2SLOCV3.js";
import {
  createHotContext
} from "/build/_shared/chunk-6IOYNRT4.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-7PHB3BFD.js";
import {
  __toESM
} from "/build/_shared/chunk-PZDJHGND.js";

// app/components/home/page-header.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/home/page-header.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/home/page-header.tsx"
  );
  import.meta.hot.lastModified = "1706341223320.9424";
}
function PageHeader({
  title,
  subtitle,
  headerImage,
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", { className: "md:px-16 mx-8 flex flex-col md:flex-row-reverse justify-center items-center gap-12 max-w-6xl md:mx-auto mt-12 mb-40 -z-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Fade, { className: "w-full", children: headerImage }, void 0, false, {
      fileName: "app/components/home/page-header.tsx",
      lineNumber: 29,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl leading-normal ", children: [
        title,
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/components/home/page-header.tsx",
          lineNumber: 33,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "mt-4 text-slate-400", children: subtitle }, void 0, false, {
          fileName: "app/components/home/page-header.tsx",
          lineNumber: 34,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/home/page-header.tsx",
        lineNumber: 31,
        columnNumber: 9
      }, this),
      children
    ] }, void 0, true, {
      fileName: "app/components/home/page-header.tsx",
      lineNumber: 30,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/home/page-header.tsx",
    lineNumber: 28,
    columnNumber: 10
  }, this);
}
_c = PageHeader;
var _c;
$RefreshReg$(_c, "PageHeader");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/header-button.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/header-button.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/header-button.tsx"
  );
  import.meta.hot.lastModified = "1706195294485.9695";
}
function HeaderButton({
  to,
  buttonText,
  icon,
  otherProps,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { children: [
    otherProps ? otherProps : null,
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex items-center gap-6 mt-12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { to, children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Button, { variant: "ghost", ...props, className: "!rounded-md  text-xl p-4  border-2", children: icon ? icon : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(BsArrowDown, { className: "text-lg animate-bounce" }, void 0, false, {
        fileName: "app/components/header-button.tsx",
        lineNumber: 37,
        columnNumber: 28
      }, this) }, void 0, false, {
        fileName: "app/components/header-button.tsx",
        lineNumber: 36,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/header-button.tsx",
        lineNumber: 35,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { className: "text-lg", children: buttonText }, void 0, false, {
        fileName: "app/components/header-button.tsx",
        lineNumber: 40,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/header-button.tsx",
      lineNumber: 34,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/header-button.tsx",
    lineNumber: 32,
    columnNumber: 10
  }, this);
}
_c2 = HeaderButton;
var _c2;
$RefreshReg$(_c2, "HeaderButton");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  PageHeader,
  HeaderButton
};
//# sourceMappingURL=/build/_shared/chunk-EDTLRGZJ.js.map
