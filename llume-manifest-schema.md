# Manifest Structure (minified JSON, no whitespace)

{
"v": 1,
"r": { …root element… },
"l": { "en": {"@K":"text",…}, "es":… },
"t": { "--p":"#0066ff", … } // global CSS vars only
}

Element (recursive):
{
"t": "div|button|input|select|…", // ONLY native HTML tags
"a": { "id":"a", "data-m-enhance":"primary filterable", … },
"c": [ …children… ],
"tx": "@Key",
"s": { "items":[], "count":0 },
"e": { "c":"f1", "i":"f2" },
"b": "items" // data-m-bind target
}

Reserved keys (never invent):
v, r, l, t, a, c, tx, s, e, b, enhance
