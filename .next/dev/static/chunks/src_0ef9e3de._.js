(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/filters/mixtapes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/filters/mixtapes.ts
__turbopack_context__.s([
    "filterMixtapes",
    ()=>filterMixtapes
]);
// Fuzzy search: checks if query matches in text
function fuzzyMatch(haystack, query) {
    const h = haystack.toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return true;
    // Exact substring match (case-insensitive)
    if (h.includes(q)) return true;
    // Fuzzy: all characters of query appear in haystack in order
    let hIdx = 0;
    for(let qIdx = 0; qIdx < q.length; qIdx++){
        const char = q.charAt(qIdx);
        const charIdx = h.indexOf(char, hIdx);
        if (charIdx === -1) return false;
        hIdx = charIdx + 1;
    }
    return true;
}
function filterMixtapes(mixtapes, criteria) {
    const q = criteria.query?.trim() ?? "";
    return mixtapes.filter(({ meta })=>{
        // Fuzzy text search: title + event + location + artist_id
        if (q) {
            const searchText = [
                meta.title,
                meta.event_name ?? "",
                meta.location ?? "",
                meta.artist_id
            ].join(" ");
            if (!fuzzyMatch(searchText, q)) return false;
        }
        // Artist filter
        if (criteria.artistIds && criteria.artistIds.length > 0) {
            if (!criteria.artistIds.includes(meta.artist_id)) return false;
        }
        // Platform filter
        if (criteria.platforms && criteria.platforms.length > 0) {
            if (!criteria.platforms.includes(meta.platform)) return false;
        }
        // Genre filter
        if (criteria.genres && criteria.genres.length > 0) {
            const matchesGenre = meta.genres.some((g)=>criteria.genres.includes(g));
            if (!matchesGenre) return false;
        }
        // Mood filter
        if (criteria.moods && criteria.moods.length > 0) {
            const matchesMood = meta.moods.some((m)=>criteria.moods.includes(m));
            if (!matchesMood) return false;
        }
        // Tag filter
        if (criteria.tags && criteria.tags.length > 0) {
            const matchesTag = meta.tags.some((t)=>criteria.tags.includes(t));
            if (!matchesTag) return false;
        }
        // Year filter (from date string)
        if (criteria.year) {
            const year = new Date(meta.date).getFullYear();
            if (year !== criteria.year) return false;
        }
        return true;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
"use client";
;
;
function Card({ href, children }) {
    const inner = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card",
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Card.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
    if (href) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            className: "block text-inherit no-underline",
            children: inner
        }, void 0, false, {
            fileName: "[project]/src/components/ui/Card.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this);
    }
    return inner;
}
_c = Card;
var _c;
__turbopack_context__.k.register(_c, "Card");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/src/components/cards/MixtapeCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MixtapeCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PlaceholderImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PlaceholderImage.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function MixtapeCard({ mixtape, artist }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        href: `/mixtapes/${mixtape.slug}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-full aspect-square overflow-hidden bg-gray-900",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PlaceholderImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: mixtape.cover_image,
                        alt: mixtape.title,
                        width: 400,
                        height: 400,
                        fill: true,
                        placeholderText: mixtape.title,
                        className: "object-cover"
                    }, void 0, false, {
                        fileName: "[project]/src/components/cards/MixtapeCard.tsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/cards/MixtapeCard.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 sm:p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "h-sm mb-2",
                            children: mixtape.title
                        }, void 0, false, {
                            fileName: "[project]/src/components/cards/MixtapeCard.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-2 text-sm text-muted",
                            children: mixtape.date
                        }, void 0, false, {
                            fileName: "[project]/src/components/cards/MixtapeCard.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, this),
                        artist && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-2 text-sm text-muted",
                            children: artist.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/cards/MixtapeCard.tsx",
                            lineNumber: 39,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-gray-600",
                            children: [
                                mixtape.platform,
                                mixtape.event_name && ` · ${mixtape.event_name}`,
                                mixtape.location && ` · ${mixtape.location}`
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/cards/MixtapeCard.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/cards/MixtapeCard.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/cards/MixtapeCard.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/cards/MixtapeCard.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = MixtapeCard;
var _c;
__turbopack_context__.k.register(_c, "MixtapeCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Section
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Section({ children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `py-16 section-band ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/Section.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = Section;
var _c;
__turbopack_context__.k.register(_c, "Section");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/mixtapes/MixtapesCatalog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MixtapesCatalog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$filters$2f$mixtapes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/filters/mixtapes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cards$2f$MixtapeCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/cards/MixtapeCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Section.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function MixtapesCatalog({ mixtapes, artists }) {
    _s();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [artistId, setArtistId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [platform, setPlatform] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [genres, setGenres] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [moods, setMoods] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tags, setTags] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [year, setYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const artistById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MixtapesCatalog.useMemo[artistById]": ()=>Object.fromEntries(artists.map({
                "MixtapesCatalog.useMemo[artistById]": (a)=>[
                        a.meta.id,
                        a.meta
                    ]
            }["MixtapesCatalog.useMemo[artistById]"]))
    }["MixtapesCatalog.useMemo[artistById]"], [
        artists
    ]);
    const allArtists = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MixtapesCatalog.useMemo[allArtists]": ()=>artists.map({
                "MixtapesCatalog.useMemo[allArtists]": (a)=>a.meta
            }["MixtapesCatalog.useMemo[allArtists]"]).sort({
                "MixtapesCatalog.useMemo[allArtists]": (a, b)=>a.name.localeCompare(b.name)
            }["MixtapesCatalog.useMemo[allArtists]"])
    }["MixtapesCatalog.useMemo[allArtists]"], [
        artists
    ]);
    const allPlatforms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MixtapesCatalog.useMemo[allPlatforms]": ()=>Array.from(new Set(mixtapes.map({
                "MixtapesCatalog.useMemo[allPlatforms]": (m)=>m.meta.platform
            }["MixtapesCatalog.useMemo[allPlatforms]"]))).sort()
    }["MixtapesCatalog.useMemo[allPlatforms]"], [
        mixtapes
    ]);
    const allGenres = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MixtapesCatalog.useMemo[allGenres]": ()=>Array.from(new Set(mixtapes.flatMap({
                "MixtapesCatalog.useMemo[allGenres]": (m)=>m.meta.genres
            }["MixtapesCatalog.useMemo[allGenres]"]))).sort()
    }["MixtapesCatalog.useMemo[allGenres]"], [
        mixtapes
    ]);
    const allMoods = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MixtapesCatalog.useMemo[allMoods]": ()=>Array.from(new Set(mixtapes.flatMap({
                "MixtapesCatalog.useMemo[allMoods]": (m)=>m.meta.moods
            }["MixtapesCatalog.useMemo[allMoods]"]))).sort()
    }["MixtapesCatalog.useMemo[allMoods]"], [
        mixtapes
    ]);
    const allTags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MixtapesCatalog.useMemo[allTags]": ()=>Array.from(new Set(mixtapes.flatMap({
                "MixtapesCatalog.useMemo[allTags]": (m)=>m.meta.tags
            }["MixtapesCatalog.useMemo[allTags]"]))).sort()
    }["MixtapesCatalog.useMemo[allTags]"], [
        mixtapes
    ]);
    const allYears = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MixtapesCatalog.useMemo[allYears]": ()=>Array.from(new Set(mixtapes.map({
                "MixtapesCatalog.useMemo[allYears]": (m)=>new Date(m.meta.date).getFullYear()
            }["MixtapesCatalog.useMemo[allYears]"]))).sort({
                "MixtapesCatalog.useMemo[allYears]": (a, b)=>b - a
            }["MixtapesCatalog.useMemo[allYears]"])
    }["MixtapesCatalog.useMemo[allYears]"], [
        mixtapes
    ]);
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MixtapesCatalog.useMemo[filtered]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$filters$2f$mixtapes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterMixtapes"])(mixtapes, {
                query,
                artistIds: artistId === "all" ? undefined : [
                    artistId
                ],
                platforms: platform === "all" ? undefined : [
                    platform
                ],
                genres: genres.length > 0 ? genres : undefined,
                moods: moods.length > 0 ? moods : undefined,
                tags: tags.length > 0 ? tags : undefined,
                year: year === "all" ? undefined : parseInt(year, 10)
            })
    }["MixtapesCatalog.useMemo[filtered]"], [
        mixtapes,
        query,
        artistId,
        platform,
        genres,
        moods,
        tags,
        year
    ]);
    const isFiltered = query || artistId !== "all" || platform !== "all" || genres.length > 0 || moods.length > 0 || tags.length > 0 || year !== "all";
    const clearFilters = ()=>{
        setQuery("");
        setArtistId("all");
        setPlatform("all");
        setGenres([]);
        setMoods([]);
        setTags([]);
        setYear("all");
    };
    const toggleGenre = (g)=>{
        setGenres((prev)=>prev.includes(g) ? prev.filter((x)=>x !== g) : [
                ...prev,
                g
            ]);
    };
    const toggleMood = (m)=>{
        setMoods((prev)=>prev.includes(m) ? prev.filter((x)=>x !== m) : [
                ...prev,
                m
            ]);
    };
    const toggleTag = (t)=>{
        setTags((prev)=>prev.includes(t) ? prev.filter((x)=>x !== t) : [
                ...prev,
                t
            ]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-4 container-sigil sm:px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "mb-6 text-center text-white h-display",
                    "data-testid": "mixtapes-page-title",
                    children: "Mixtapes"
                }, void 0, false, {
                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                    lineNumber: 132,
                    columnNumber: 8
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        placeholder: "Search titles, events, locations, or artists...",
                        value: query,
                        onChange: (e)=>setQuery(e.target.value),
                        className: "w-full px-3 py-2 text-sm border border-gray-700 rounded bg-gray-950 focus:outline-none focus:border-gray-600"
                    }, void 0, false, {
                        fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                    lineNumber: 135,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-2 mb-4 sm:grid-cols-2 lg:grid-cols-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            "aria-label": "Filter by artist",
                            value: artistId,
                            onChange: (e)=>setArtistId(e.target.value),
                            className: "px-2 py-1 text-sm border border-gray-700 rounded bg-gray-950 focus:outline-none focus:border-gray-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "all",
                                    children: "All artists"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                                    lineNumber: 154,
                                    columnNumber: 11
                                }, this),
                                allArtists.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: a.id,
                                        children: a.name
                                    }, a.id, false, {
                                        fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                                        lineNumber: 156,
                                        columnNumber: 13
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                            lineNumber: 148,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            "aria-label": "Filter by platform",
                            value: platform,
                            onChange: (e)=>setPlatform(e.target.value),
                            className: "px-2 py-1 text-sm border border-gray-700 rounded bg-gray-950 focus:outline-none focus:border-gray-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "all",
                                    children: "All platforms"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                                    lineNumber: 169,
                                    columnNumber: 11
                                }, this),
                                allPlatforms.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: p,
                                        children: p
                                    }, p, false, {
                                        fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                                        lineNumber: 171,
                                        columnNumber: 13
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                            lineNumber: 163,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            "aria-label": "Filter by year",
                            value: year,
                            onChange: (e)=>setYear(e.target.value),
                            className: "px-2 py-1 text-sm border border-gray-700 rounded bg-gray-950 focus:outline-none focus:border-gray-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "all",
                                    children: "All years"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                                    lineNumber: 184,
                                    columnNumber: 11
                                }, this),
                                allYears.map((y)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: y,
                                        children: y
                                    }, y, false, {
                                        fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                                        lineNumber: 186,
                                        columnNumber: 13
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                            lineNumber: 178,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                    lineNumber: 146,
                    columnNumber: 7
                }, this),
                allGenres.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase",
                            children: "Genres"
                        }, void 0, false, {
                            fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                            lineNumber: 196,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: allGenres.map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>toggleGenre(g),
                                    className: `px-3 py-1 rounded-full text-xs font-medium transition-colors ${genres.includes(g) ? "bg-white text-black border border-white" : "bg-gray-900 text-gray-300 border border-gray-700 hover:border-gray-600"}`,
                                    children: g
                                }, g, false, {
                                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                                    lineNumber: 201,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                            lineNumber: 199,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                    lineNumber: 195,
                    columnNumber: 9
                }, this),
                allMoods.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase",
                            children: "Moods"
                        }, void 0, false, {
                            fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                            lineNumber: 220,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: allMoods.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>toggleMood(m),
                                    className: `px-3 py-1 rounded-full text-xs font-medium transition-colors ${moods.includes(m) ? "bg-white text-black border border-white" : "bg-gray-900 text-gray-300 border border-gray-700 hover:border-gray-600"}`,
                                    children: m
                                }, m, false, {
                                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                                    lineNumber: 225,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                            lineNumber: 223,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                    lineNumber: 219,
                    columnNumber: 9
                }, this),
                allTags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase",
                            children: "Tags"
                        }, void 0, false, {
                            fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: allTags.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>toggleTag(t),
                                    className: `px-3 py-1 rounded-full text-xs font-medium transition-colors ${tags.includes(t) ? "bg-white text-black border border-white" : "bg-gray-900 text-gray-300 border border-gray-700 hover:border-gray-600"}`,
                                    children: t
                                }, t, false, {
                                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                                    lineNumber: 249,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                            lineNumber: 247,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                    lineNumber: 243,
                    columnNumber: 9
                }, this),
                isFiltered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 mb-6 bg-gray-900 border border-gray-800 rounded",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-300",
                                children: [
                                    "Showing ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold",
                                        children: filtered.length
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                                        lineNumber: 270,
                                        columnNumber: 23
                                    }, this),
                                    " of",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold",
                                        children: mixtapes.length
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                                        lineNumber: 271,
                                        columnNumber: 15
                                    }, this),
                                    " mixtapes"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                                lineNumber: 269,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: clearFilters,
                                className: "px-3 py-1 text-sm text-white transition-colors bg-gray-800 border border-gray-700 rounded hover:bg-gray-700",
                                children: "Clear filters"
                            }, void 0, false, {
                                fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                                lineNumber: 273,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                        lineNumber: 268,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                    lineNumber: 267,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
                    children: filtered.map(({ meta })=>{
                        const artist = artistById[meta.artist_id] ?? null;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cards$2f$MixtapeCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            mixtape: meta,
                            artist: artist
                        }, meta.id, false, {
                            fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                            lineNumber: 287,
                            columnNumber: 18
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                    lineNumber: 284,
                    columnNumber: 7
                }, this),
                filtered.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-4 text-sm opacity-70",
                    children: [
                        "No mixtapes match the current filters. ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: clearFilters,
                            className: "underline hover:text-white",
                            children: "Clear filters"
                        }, void 0, false, {
                            fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                            lineNumber: 293,
                            columnNumber: 50
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
                    lineNumber: 292,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
            lineNumber: 131,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/mixtapes/MixtapesCatalog.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_s(MixtapesCatalog, "kkWPl50nf35e7L60K1fRk2cGXKM=");
_c = MixtapesCatalog;
var _c;
__turbopack_context__.k.register(_c, "MixtapesCatalog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0ef9e3de._.js.map