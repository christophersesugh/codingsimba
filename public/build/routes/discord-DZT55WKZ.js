import {
  HeaderButton,
  PageHeader
} from "/build/_shared/chunk-EDTLRGZJ.js";
import {
  DiscordButton
} from "/build/_shared/chunk-QPY57N7U.js";
import "/build/_shared/chunk-OXGF3ABJ.js";
import {
  require_page
} from "/build/_shared/chunk-A2L3DPIP.js";
import {
  Markdown
} from "/build/_shared/chunk-PH6KTJR6.js";
import "/build/_shared/chunk-BQSA676N.js";
import {
  BsDiscord
} from "/build/_shared/chunk-7GNGWBYG.js";
import "/build/_shared/chunk-2QJY4JOV.js";
import {
  require_node
} from "/build/_shared/chunk-NBEH4DGX.js";
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

// app/routes/discord.tsx
var import_node = __toESM(require_node(), 1);
var import_page = __toESM(require_page(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/discord.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/discord.tsx"
  );
  import.meta.hot.lastModified = "1706198006356.5198";
}
var meta = metaFn;
function Discord() {
  _s();
  const {
    content
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, { title: "Join Coding Simba's discord community for engaging conversations on all things Tech!", headerImage: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BsDiscord, { className: "text-[18rem] block animate-pulse mx-auto" }, void 0, false, {
      fileName: "app/routes/discord.tsx",
      lineNumber: 45,
      columnNumber: 125
    }, this), children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeaderButton, { to: "#reasons", buttonText: "Why you should join CS' discord community...", otherProps: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DiscordButton, {}, void 0, false, {
      fileName: "app/routes/discord.tsx",
      lineNumber: 46,
      columnNumber: 107
    }, this) }, void 0, false, {
      fileName: "app/routes/discord.tsx",
      lineNumber: 46,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/discord.tsx",
      lineNumber: 45,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, { className: "max-w-3xl flex flex-col items-center mx-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "dark:text-slate-300 text-slate-600", id: "reasons", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Markdown, { source: content }, void 0, false, {
        fileName: "app/routes/discord.tsx",
        lineNumber: 50,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/discord.tsx",
        lineNumber: 49,
        columnNumber: 9
      }, this),
      " ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DiscordButton, {}, void 0, false, {
        fileName: "app/routes/discord.tsx",
        lineNumber: 52,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/discord.tsx",
      lineNumber: 48,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/discord.tsx",
    lineNumber: 44,
    columnNumber: 10
  }, this);
}
_s(Discord, "t8fJA4Kz9OOMVddc0s1pdl7daiI=", false, function() {
  return [useLoaderData];
});
_c = Discord;
var _c;
$RefreshReg$(_c, "Discord");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Discord as default,
  meta
};
//# sourceMappingURL=/build/routes/discord-DZT55WKZ.js.map
