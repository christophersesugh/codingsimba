import {
  $8927f6f2acc4f386$export$250ffa63cdc0d034
} from "/build/_shared/chunk-4GO5WTWR.js";
import {
  BlogCard,
  EmptyContentUI,
  require_blog
} from "/build/_shared/chunk-HRGXIZDH.js";
import "/build/_shared/chunk-TYKTURUQ.js";
import {
  require_node
} from "/build/_shared/chunk-NBEH4DGX.js";
import {
  Button,
  _extends,
  cva
} from "/build/_shared/chunk-MLG4T7FR.js";
import {
  useLoaderData,
  useSubmit
} from "/build/_shared/chunk-A2SLOCV3.js";
import "/build/_shared/chunk-WEAPBHQG.js";
import {
  Container
} from "/build/_shared/chunk-3QLU3XWV.js";
import {
  metaFn
} from "/build/_shared/chunk-IQWGNDUA.js";
import "/build/_shared/chunk-2DLHY7YA.js";
import "/build/_shared/chunk-2ZEF6LYD.js";
import {
  cn
} from "/build/_shared/chunk-RX5LCL75.js";
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

// app/routes/blog._index.tsx
var import_react4 = __toESM(require_react(), 1);
var import_node = __toESM(require_node(), 1);

// app/components/tags.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/tags.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/tags.tsx"
  );
  import.meta.hot.lastModified = "1706203266281.5415";
}
function TagsC({
  tags
}) {
  _s();
  const submit = useSubmit();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "font-bold mb-4", children: "Search blog by topics:" }, void 0, false, {
      fileName: "app/components/tags.tsx",
      lineNumber: 31,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-wrap mb-4 gap-4", children: tags ? tags?.map((tag, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { value: tag, name: "tag", onClick: () => {
      submit({
        tag: tag || null
      }, {
        preventScrollReset: true
      });
    }, className: "bg-zinc-500 px-2 py-1 rounded-xl text-white hover:border-2 focus:border-2 border-blue-500 duration-200", children: tag }, `${tag}-${index}`, false, {
      fileName: "app/components/tags.tsx",
      lineNumber: 33,
      columnNumber: 43
    }, this)) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-slate-400", children: "No post tags." }, void 0, false, {
      fileName: "app/components/tags.tsx",
      lineNumber: 41,
      columnNumber: 26
    }, this) }, void 0, false, {
      fileName: "app/components/tags.tsx",
      lineNumber: 32,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/tags.tsx",
    lineNumber: 30,
    columnNumber: 10
  }, this);
}
_s(TagsC, "/qFIYzOq2OE/SSM69ffcyD0/sOE=", false, function() {
  return [useSubmit];
});
_c = TagsC;
var Tags = import_react.default.memo(TagsC);
_c2 = Tags;
var _c;
var _c2;
$RefreshReg$(_c, "TagsC");
$RefreshReg$(_c2, "Tags");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/blog._index.tsx
var import_blog = __toESM(require_blog(), 1);

// app/components/ui/input.tsx
var React2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/ui/input.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/ui/input.tsx"
  );
  import.meta.hot.lastModified = "1706913371845.0522";
}
var Input = React2.forwardRef(_c3 = ({
  className,
  type,
  ...props
}, ref) => {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type, className: cn("flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300", className), ref, ...props }, void 0, false, {
    fileName: "app/components/ui/input.tsx",
    lineNumber: 31,
    columnNumber: 10
  }, this);
});
_c22 = Input;
Input.displayName = "Input";
var _c3;
var _c22;
$RefreshReg$(_c3, "Input$React.forwardRef");
$RefreshReg$(_c22, "Input");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/ui/label.tsx
var React3 = __toESM(require_react(), 1);

// node_modules/@radix-ui/react-label/dist/index.mjs
var import_react3 = __toESM(require_react(), 1);
var $b73a6c6685e72184$export$b04be29aa201d4f5 = /* @__PURE__ */ (0, import_react3.forwardRef)((props, forwardedRef) => {
  return /* @__PURE__ */ (0, import_react3.createElement)($8927f6f2acc4f386$export$250ffa63cdc0d034.label, _extends({}, props, {
    ref: forwardedRef,
    onMouseDown: (event) => {
      var _props$onMouseDown;
      (_props$onMouseDown = props.onMouseDown) === null || _props$onMouseDown === void 0 || _props$onMouseDown.call(props, event);
      if (!event.defaultPrevented && event.detail > 1)
        event.preventDefault();
    }
  }));
});
var $b73a6c6685e72184$export$be92b6f5f03c0fe9 = $b73a6c6685e72184$export$b04be29aa201d4f5;

// app/components/ui/label.tsx
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/ui/label.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/ui/label.tsx"
  );
  import.meta.hot.lastModified = "1706903779413.8442";
}
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = React3.forwardRef(_c4 = ({
  className,
  ...props
}, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)($b73a6c6685e72184$export$be92b6f5f03c0fe9, { ref, className: cn(labelVariants(), className), ...props }, void 0, false, {
  fileName: "app/components/ui/label.tsx",
  lineNumber: 29,
  columnNumber: 12
}, this));
_c23 = Label;
Label.displayName = $b73a6c6685e72184$export$be92b6f5f03c0fe9.displayName;
var _c4;
var _c23;
$RefreshReg$(_c4, "Label$React.forwardRef");
$RefreshReg$(_c23, "Label");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/blog._index.tsx
var import_jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/blog._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/blog._index.tsx"
  );
  import.meta.hot.lastModified = "1706201184179.384";
}
var meta = metaFn;
function Blog() {
  _s2();
  const [postLimit, setPostLimit] = import_react4.default.useState(6);
  const {
    posts,
    tags
  } = useLoaderData();
  const submit = useSubmit();
  const submitOptions = import_react4.default.useMemo(() => ({
    method: "GET",
    preventScrollReset: true
  }), []);
  function handleFormChange(event) {
    const {
      name,
      value
    } = event.target;
    submit({
      [name]: value
    }, submitOptions);
  }
  const increasePostLimit = import_react4.default.useCallback(() => {
    setPostLimit((prevLimit) => {
      const newLimit = prevLimit + 6;
      return newLimit;
    });
    submit({
      postLimit
    }, submitOptions);
  }, [postLimit, submit, submitOptions]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Container, { className: "!max-w-4xl flex flex-col justify-center my-20", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h1", { className: "mb-12 text-3xl font-bol max-w-md", children: [
      "Exploring the World of Development:",
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("span", { className: "text-slate-400", children: " Dive into My Latest Articles" }, void 0, false, {
        fileName: "app/routes/blog._index.tsx",
        lineNumber: 78,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/blog._index.tsx",
      lineNumber: 76,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "mb-16 flex flex-col gap-12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Label, { htmlFor: "search", className: "text-lg", children: "Search the blog:" }, void 0, false, {
          fileName: "app/routes/blog._index.tsx",
          lineNumber: 83,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Input, { type: "search", name: "search", id: "search", placeholder: "search posts", onChange: handleFormChange, className: "bg-slate-300 text-black md:w-[50%]" }, void 0, false, {
          fileName: "app/routes/blog._index.tsx",
          lineNumber: 86,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/blog._index.tsx",
        lineNumber: 82,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Tags, { tags }, void 0, false, {
        fileName: "app/routes/blog._index.tsx",
        lineNumber: 89,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/blog._index.tsx",
      lineNumber: 80,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { children: !posts?.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(EmptyContentUI, { message: "no posts found with given query." }, void 0, false, {
      fileName: "app/routes/blog._index.tsx",
      lineNumber: 94,
      columnNumber: 27
    }, this) : null }, void 0, false, {
      fileName: "app/routes/blog._index.tsx",
      lineNumber: 92,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-20 justify-evenly my-12", children: posts && posts?.length ? posts.map((post, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(BlogCard, { post }, `${post.data.slug}-${index}`, false, {
      fileName: "app/routes/blog._index.tsx",
      lineNumber: 99,
      columnNumber: 62
    }, this)) : null }, void 0, false, {
      fileName: "app/routes/blog._index.tsx",
      lineNumber: 98,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Button, { variant: "outline", onClick: increasePostLimit, className: "border-2  mx-auto rounded-md p-4 capitalize", children: "load more posts" }, void 0, false, {
      fileName: "app/routes/blog._index.tsx",
      lineNumber: 103,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/blog._index.tsx",
    lineNumber: 75,
    columnNumber: 10
  }, this);
}
_s2(Blog, "RwRo6/Kbm1mBqvheJ31xyhwkkbI=", false, function() {
  return [useLoaderData, useSubmit];
});
_c5 = Blog;
var blog_index_default = _c24 = import_react4.default.memo(Blog);
var _c5;
var _c24;
$RefreshReg$(_c5, "Blog");
$RefreshReg$(_c24, "%default%");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  blog_index_default as default,
  meta
};
//# sourceMappingURL=/build/routes/blog._index-GZUJSKWD.js.map
