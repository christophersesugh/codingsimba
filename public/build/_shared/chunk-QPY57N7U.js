import {
  BsDiscord
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

// app/components/discord-button.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/discord-button.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/discord-button.tsx"
  );
  import.meta.hot.lastModified = "1706197060867.5723";
}
var discordUrl = "https://discord.gg/7uZ6PWf4Xv";
function DiscordButton({
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { ...props, className: "border-2 flex items-center gap-4 self-center p-4 my-6", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: discordUrl, target: "_blank", rel: "noreferrer", children: [
    "Join Discord ",
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BsDiscord, { className: "inline animate-bounce" }, void 0, false, {
      fileName: "app/components/discord-button.tsx",
      lineNumber: 30,
      columnNumber: 22
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/discord-button.tsx",
    lineNumber: 29,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/discord-button.tsx",
    lineNumber: 28,
    columnNumber: 10
  }, this);
}
_c = DiscordButton;
var _c;
$RefreshReg$(_c, "DiscordButton");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  DiscordButton
};
//# sourceMappingURL=/build/_shared/chunk-QPY57N7U.js.map
