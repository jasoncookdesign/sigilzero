(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/placehold.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPlaceholdUrl",
    ()=>buildPlaceholdUrl,
    "default",
    ()=>__TURBOPACK__default__export__
]);
const DEFAULT_BG = "EEE";
const DEFAULT_FG = "31343C";
function buildPlaceholdUrl(opts) {
    const width = Math.max(10, Math.min(4000, Math.floor(opts.width)));
    const height = opts.height ? Math.max(10, Math.min(4000, Math.floor(opts.height))) : undefined;
    const size = height ? `${width}x${height}` : `${width}`;
    const format = opts.format ?? "png";
    const bg = opts.background ?? DEFAULT_BG;
    const fg = opts.color ?? DEFAULT_FG;
    // base path like /600x400/000/FFF.png
    const extPart = `.${format}`;
    const colorPart = `${encodeURIComponent(String(bg))}/${encodeURIComponent(String(fg))}`;
    let url = `https://placehold.co/${size}/${colorPart}${extPart}`;
    const qs = new URLSearchParams();
    if (opts.text) qs.set("text", String(opts.text));
    if (opts.font) qs.set("font", String(opts.font));
    if (opts.retina && format !== "svg") qs.set("@", `${opts.retina}x`);
    const q = qs.toString();
    if (q) url += `?${q}`;
    return url;
}
const __TURBOPACK__default__export__ = {
    buildPlaceholdUrl
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/PlaceholderImage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PlaceholderImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$placehold$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/placehold.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function PlaceholderImage({ src, alt, width, height, placeholderText, className, fill, objectFit = "cover" }) {
    _s();
    const [imgError, setImgError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Use placeholder if src is missing or if image failed to load
    const usePlaceholder = !src || src.trim() === "" || imgError;
    const finalSrc = usePlaceholder ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$placehold$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildPlaceholdUrl"])({
        width,
        height,
        format: "svg",
        background: "1a1a1a",
        color: "666666",
        text: placeholderText || `${width}x${height}`
    }) : src;
    if (fill) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: finalSrc,
            alt: alt,
            fill: true,
            className: className,
            style: {
                objectFit
            },
            onError: ()=>!usePlaceholder && setImgError(true),
            unoptimized: usePlaceholder
        }, void 0, false, {
            fileName: "[project]/src/components/PlaceholderImage.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        src: finalSrc,
        alt: alt,
        width: width,
        height: height,
        className: className,
        style: {
            objectFit
        },
        onError: ()=>!usePlaceholder && setImgError(true),
        unoptimized: usePlaceholder
    }, void 0, false, {
        fileName: "[project]/src/components/PlaceholderImage.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_s(PlaceholderImage, "0doYx/lFKmVVbvtO/eWR8SJrtgo=");
_c = PlaceholderImage;
var _c;
__turbopack_context__.k.register(_c, "PlaceholderImage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_6a369c16._.js.map