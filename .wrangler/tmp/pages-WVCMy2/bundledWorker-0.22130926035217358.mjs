var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// _worker.js/index.js
import("node:buffer").then(({ Buffer: Buffer2 }) => {
  globalThis.Buffer = Buffer2;
}).catch(() => null);
var __ALSes_PROMISE__ = import("node:async_hooks").then(({ AsyncLocalStorage }) => {
  globalThis.AsyncLocalStorage = AsyncLocalStorage;
  const envAsyncLocalStorage = new AsyncLocalStorage();
  const requestContextAsyncLocalStorage = new AsyncLocalStorage();
  globalThis.process = {
    env: new Proxy(
      {},
      {
        ownKeys: /* @__PURE__ */ __name(() => Reflect.ownKeys(envAsyncLocalStorage.getStore()), "ownKeys"),
        getOwnPropertyDescriptor: /* @__PURE__ */ __name((_2, ...args) => Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
        get: /* @__PURE__ */ __name((_2, property) => Reflect.get(envAsyncLocalStorage.getStore(), property), "get"),
        set: /* @__PURE__ */ __name((_2, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value), "set")
      }
    )
  };
  globalThis[Symbol.for("__cloudflare-request-context__")] = new Proxy(
    {},
    {
      ownKeys: /* @__PURE__ */ __name(() => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()), "ownKeys"),
      getOwnPropertyDescriptor: /* @__PURE__ */ __name((_2, ...args) => Reflect.getOwnPropertyDescriptor(requestContextAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
      get: /* @__PURE__ */ __name((_2, property) => Reflect.get(requestContextAsyncLocalStorage.getStore(), property), "get"),
      set: /* @__PURE__ */ __name((_2, property, value) => Reflect.set(requestContextAsyncLocalStorage.getStore(), property, value), "set")
    }
  );
  return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
}).catch(() => null);
var at = Object.create;
var V = Object.defineProperty;
var nt = Object.getOwnPropertyDescriptor;
var rt = Object.getOwnPropertyNames;
var it = Object.getPrototypeOf;
var ot = Object.prototype.hasOwnProperty;
var A = /* @__PURE__ */ __name((t, e) => () => (t && (e = t(t = 0)), e), "A");
var U = /* @__PURE__ */ __name((t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports), "U");
var ct = /* @__PURE__ */ __name((t, e, a, s) => {
  if (e && typeof e == "object" || typeof e == "function") for (let r of rt(e)) !ot.call(t, r) && r !== a && V(t, r, { get: /* @__PURE__ */ __name(() => e[r], "get"), enumerable: !(s = nt(e, r)) || s.enumerable });
  return t;
}, "ct");
var q = /* @__PURE__ */ __name((t, e, a) => (a = t != null ? at(it(t)) : {}, ct(e || !t || !t.__esModule ? V(a, "default", { value: t, enumerable: true }) : a, t)), "q");
var g;
var l = A(() => {
  g = { collectedLocales: [] };
});
var f;
var u = A(() => {
  f = { version: 3, routes: { none: [{ src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^/404/?$", status: 404, continue: true }, { src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308 }], filesystem: [{ src: "^/_next/data/(.*)$", dest: "/_next/data/$1", check: true }, { src: "^/_next/data/(.*)$", status: 404 }], miss: [{ src: "^/_next/static/.+$", status: 404, check: true, dest: "/_next/static/not-found.txt", headers: { "content-type": "text/plain; charset=utf-8" } }], rewrite: [], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|5wdhqM1VVi5qpHuR\\-HcfN)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }], error: [{ status: 404, src: "^.*$", dest: "/404" }] }, overrides: { "404.html": { path: "404", contentType: "text/html; charset=utf-8" }, "_not-found.html": { path: "_not-found", contentType: "text/html; charset=utf-8" }, "admin.html": { path: "admin", contentType: "text/html; charset=utf-8" }, "admin/featured.html": { path: "admin/featured", contentType: "text/html; charset=utf-8" }, "admin/instagram.html": { path: "admin/instagram", contentType: "text/html; charset=utf-8" }, "admin/login.html": { path: "admin/login", contentType: "text/html; charset=utf-8" }, "calendar.html": { path: "calendar", contentType: "text/html; charset=utf-8" }, "index.html": { path: "index", contentType: "text/html; charset=utf-8" }, "weather-guide.html": { path: "weather-guide", contentType: "text/html; charset=utf-8" }, "weather.html": { path: "weather", contentType: "text/html; charset=utf-8" } }, framework: { version: "16.0.0" }, crons: [] };
});
var m;
var d = A(() => {
  m = { "/404.html": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/__next.__PAGE__.txt": { type: "static" }, "/__next._full.txt": { type: "static" }, "/__next._index.txt": { type: "static" }, "/__next._tree.txt": { type: "static" }, "/_next/static/5wdhqM1VVi5qpHuR-HcfN/_buildManifest.js": { type: "static" }, "/_next/static/5wdhqM1VVi5qpHuR-HcfN/_clientMiddlewareManifest.json": { type: "static" }, "/_next/static/5wdhqM1VVi5qpHuR-HcfN/_ssgManifest.js": { type: "static" }, "/_next/static/chunks/0430b64e5ebb147b.js": { type: "static" }, "/_next/static/chunks/093d5a5c8d08a671.js": { type: "static" }, "/_next/static/chunks/104b1cd254e67361.js": { type: "static" }, "/_next/static/chunks/18a3f78fa8248e1f.js": { type: "static" }, "/_next/static/chunks/1e109efa3fe1594f.js": { type: "static" }, "/_next/static/chunks/250784b97536516c.js": { type: "static" }, "/_next/static/chunks/311adc567e37e9a6.js": { type: "static" }, "/_next/static/chunks/355483ed924568cf.js": { type: "static" }, "/_next/static/chunks/3d040a479b1df73f.js": { type: "static" }, "/_next/static/chunks/46fcd7311f91853e.js": { type: "static" }, "/_next/static/chunks/508df5c07a32a007.js": { type: "static" }, "/_next/static/chunks/54b762634ed425ba.js": { type: "static" }, "/_next/static/chunks/5d5e03acf2f3037a.js": { type: "static" }, "/_next/static/chunks/6940c380aa19d0db.js": { type: "static" }, "/_next/static/chunks/6ea2dba349aa691f.css": { type: "static" }, "/_next/static/chunks/6ee453533773484c.js": { type: "static" }, "/_next/static/chunks/7ea007cd3243602b.js": { type: "static" }, "/_next/static/chunks/84058d0b912d4919.js": { type: "static" }, "/_next/static/chunks/8fa3c5e35ad25e3f.js": { type: "static" }, "/_next/static/chunks/97458caf7aae886f.js": { type: "static" }, "/_next/static/chunks/9c2db87c41ccf9a3.js": { type: "static" }, "/_next/static/chunks/a6dad97d9634a72d.js": { type: "static" }, "/_next/static/chunks/ae7d9e26d02a451d.js": { type: "static" }, "/_next/static/chunks/b80239997a52ade6.js": { type: "static" }, "/_next/static/chunks/cb3518eac3f183c3.js": { type: "static" }, "/_next/static/chunks/e4e56795cf52c5e2.js": { type: "static" }, "/_next/static/chunks/eb61beaa022fd4b8.js": { type: "static" }, "/_next/static/chunks/ecb222019734631a.js": { type: "static" }, "/_next/static/chunks/f4fb853cb1e5bd08.js": { type: "static" }, "/_next/static/chunks/faf1f25f2d29ad6c.js": { type: "static" }, "/_next/static/chunks/turbopack-320e1b65813fc107.js": { type: "static" }, "/_next/static/media/1bffadaabf893a1e-s.7cd81963.woff2": { type: "static" }, "/_next/static/media/20aee433927f7d4b-s.a2c089c6.woff2": { type: "static" }, "/_next/static/media/256e1f7f180674ba-s.afa27594.woff2": { type: "static" }, "/_next/static/media/292081311a6a8abc-s.2a17492d.woff2": { type: "static" }, "/_next/static/media/2bbe8d2671613f1f-s.76dcb0b2.woff2": { type: "static" }, "/_next/static/media/2c55a0e60120577a-s.2a48534a.woff2": { type: "static" }, "/_next/static/media/4fa387ec64143e14-s.c1fdd6c2.woff2": { type: "static" }, "/_next/static/media/5476f68d60460930-s.c995e352.woff2": { type: "static" }, "/_next/static/media/68d403cf9f2c68c5-s.p.f9f15f61.woff2": { type: "static" }, "/_next/static/media/753b6407f468151f-s.504826d2.woff2": { type: "static" }, "/_next/static/media/797e433ab948586e-s.p.dbea232f.woff2": { type: "static" }, "/_next/static/media/83afe278b6a6bb3c-s.p.3a6ba036.woff2": { type: "static" }, "/_next/static/media/9c72aa0f40e4eef8-s.18a48cbc.woff2": { type: "static" }, "/_next/static/media/ad66f9afd8947f86-s.7a40eb73.woff2": { type: "static" }, "/_next/static/media/bbc41e54d2fcbd21-s.799d8ef8.woff2": { type: "static" }, "/_next/static/media/be3bf58b83159894-s.7b13a9eb.woff2": { type: "static" }, "/_not-found/__next._full.txt": { type: "static" }, "/_not-found/__next._index.txt": { type: "static" }, "/_not-found/__next._not-found.__PAGE__.txt": { type: "static" }, "/_not-found/__next._not-found.txt": { type: "static" }, "/_not-found/__next._tree.txt": { type: "static" }, "/_not-found.html": { type: "override", path: "/_not-found.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_not-found.txt": { type: "static" }, "/admin/__next._full.txt": { type: "static" }, "/admin/__next._index.txt": { type: "static" }, "/admin/__next._tree.txt": { type: "static" }, "/admin/__next.admin.__PAGE__.txt": { type: "static" }, "/admin/__next.admin.txt": { type: "static" }, "/admin/featured/__next._full.txt": { type: "static" }, "/admin/featured/__next._index.txt": { type: "static" }, "/admin/featured/__next._tree.txt": { type: "static" }, "/admin/featured/__next.admin.featured.__PAGE__.txt": { type: "static" }, "/admin/featured/__next.admin.featured.txt": { type: "static" }, "/admin/featured/__next.admin.txt": { type: "static" }, "/admin/featured.html": { type: "override", path: "/admin/featured.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/admin/featured.txt": { type: "static" }, "/admin/instagram/__next._full.txt": { type: "static" }, "/admin/instagram/__next._index.txt": { type: "static" }, "/admin/instagram/__next._tree.txt": { type: "static" }, "/admin/instagram/__next.admin.instagram.__PAGE__.txt": { type: "static" }, "/admin/instagram/__next.admin.instagram.txt": { type: "static" }, "/admin/instagram/__next.admin.txt": { type: "static" }, "/admin/instagram.html": { type: "override", path: "/admin/instagram.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/admin/instagram.txt": { type: "static" }, "/admin/login/__next._full.txt": { type: "static" }, "/admin/login/__next._index.txt": { type: "static" }, "/admin/login/__next._tree.txt": { type: "static" }, "/admin/login/__next.admin.login.__PAGE__.txt": { type: "static" }, "/admin/login/__next.admin.login.txt": { type: "static" }, "/admin/login/__next.admin.txt": { type: "static" }, "/admin/login.html": { type: "override", path: "/admin/login.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/admin/login.txt": { type: "static" }, "/admin.html": { type: "override", path: "/admin.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/admin.txt": { type: "static" }, "/apple-icon.png": { type: "static" }, "/calendar/__next._full.txt": { type: "static" }, "/calendar/__next._index.txt": { type: "static" }, "/calendar/__next._tree.txt": { type: "static" }, "/calendar/__next.calendar.__PAGE__.txt": { type: "static" }, "/calendar/__next.calendar.txt": { type: "static" }, "/calendar.html": { type: "override", path: "/calendar.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/calendar.txt": { type: "static" }, "/chicago-lakefront-running-soldier-field-skyline.jpg": { type: "static" }, "/chicago-skyline-view-from-lakefront-trail.jpg": { type: "static" }, "/group-of-runners-at-sunrise-on-chicago-lakefront.jpg": { type: "static" }, "/group-of-runners-on-chicago-lakefront-at-sunrise.jpg": { type: "static" }, "/group-of-runners-stretching-before-run.jpg": { type: "static" }, "/group-photo-of-runners-in-south-loop-chicago.jpg": { type: "static" }, "/group-photo-of-running-club-members-smiling.jpg": { type: "static" }, "/icon-dark-32x32.png": { type: "static" }, "/icon-light-32x32.png": { type: "static" }, "/icon.svg": { type: "static" }, "/images/design-mode/image.png": { type: "static" }, "/images/design-mode/slr-logo.jpg": { type: "static" }, "/index.html": { type: "override", path: "/index.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/index.txt": { type: "static" }, "/mccormick-place-chicago-auto-show-indoor-running.jpg": { type: "static" }, "/placeholder-logo.png": { type: "static" }, "/placeholder-logo.svg": { type: "static" }, "/placeholder-user.jpg": { type: "static" }, "/placeholder.jpg": { type: "static" }, "/placeholder.svg": { type: "static" }, "/post-run-coffee-and-bagels-with-runners.jpg": { type: "static" }, "/runners-at-grant-park-buckingham-fountain-chicago.jpg": { type: "static" }, "/runners-crossing-chicago-marathon-finish-line.jpg": { type: "static" }, "/runners-in-winter-gear-running-in-snow.jpg": { type: "static" }, "/runners-on-snowy-chicago-winter-trail.jpg": { type: "static" }, "/slr-group-celebrating-medals.jpg": { type: "static" }, "/slr-group-photo-with-logo.jpg": { type: "static" }, "/slr-group-photo.jpeg": { type: "static" }, "/slr-logo-tight.jpg": { type: "static" }, "/slr-logo.jpg": { type: "static" }, "/slr-logo.png": { type: "static" }, "/south-loop-runners-logo.png": { type: "static" }, "/weather/__next._full.txt": { type: "static" }, "/weather/__next._index.txt": { type: "static" }, "/weather/__next._tree.txt": { type: "static" }, "/weather/__next.weather.__PAGE__.txt": { type: "static" }, "/weather/__next.weather.txt": { type: "static" }, "/weather-guide/__next._full.txt": { type: "static" }, "/weather-guide/__next._index.txt": { type: "static" }, "/weather-guide/__next._tree.txt": { type: "static" }, "/weather-guide/__next.weather-guide.__PAGE__.txt": { type: "static" }, "/weather-guide/__next.weather-guide.txt": { type: "static" }, "/weather-guide.html": { type: "override", path: "/weather-guide.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/weather-guide.txt": { type: "static" }, "/weather.html": { type: "override", path: "/weather.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/weather.txt": { type: "static" }, "/404": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_not-found": { type: "override", path: "/_not-found.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/admin": { type: "override", path: "/admin.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/admin/featured": { type: "override", path: "/admin/featured.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/admin/instagram": { type: "override", path: "/admin/instagram.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/admin/login": { type: "override", path: "/admin/login.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/calendar": { type: "override", path: "/calendar.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/index": { type: "override", path: "/index.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/": { type: "override", path: "/index.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/weather-guide": { type: "override", path: "/weather-guide.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/weather": { type: "override", path: "/weather.html", headers: { "content-type": "text/html; charset=utf-8" } } };
});
var F = U((zt, $) => {
  "use strict";
  l();
  u();
  d();
  function w(t, e) {
    t = String(t || "").trim();
    let a = t, s, r = "";
    if (/^[^a-zA-Z\\\s]/.test(t)) {
      s = t[0];
      let o = t.lastIndexOf(s);
      r += t.substring(o + 1), t = t.substring(1, o);
    }
    let n = 0;
    return t = dt(t, (o) => {
      if (/^\(\?[P<']/.test(o)) {
        let c = /^\(\?P?[<']([^>']+)[>']/.exec(o);
        if (!c) throw new Error(`Failed to extract named captures from ${JSON.stringify(o)}`);
        let h = o.substring(c[0].length, o.length - 1);
        return e && (e[n] = c[1]), n++, `(${h})`;
      }
      return o.substring(0, 3) === "(?:" || n++, o;
    }), t = t.replace(/\[:([^:]+):\]/g, (o, c) => w.characterClasses[c] || o), new w.PCRE(t, r, a, r, s);
  }
  __name(w, "w");
  function dt(t, e) {
    let a = 0, s = 0, r = false;
    for (let i = 0; i < t.length; i++) {
      let n = t[i];
      if (r) {
        r = false;
        continue;
      }
      switch (n) {
        case "(":
          s === 0 && (a = i), s++;
          break;
        case ")":
          if (s > 0 && (s--, s === 0)) {
            let o = i + 1, c = a === 0 ? "" : t.substring(0, a), h = t.substring(o), p = String(e(t.substring(a, o)));
            t = c + p + h, i = a;
          }
          break;
        case "\\":
          r = true;
          break;
        default:
          break;
      }
    }
    return t;
  }
  __name(dt, "dt");
  (function(t) {
    class e extends RegExp {
      static {
        __name(this, "e");
      }
      constructor(s, r, i, n, o) {
        super(s, r), this.pcrePattern = i, this.pcreFlags = n, this.delimiter = o;
      }
    }
    t.PCRE = e, t.characterClasses = { alnum: "[A-Za-z0-9]", word: "[A-Za-z0-9_]", alpha: "[A-Za-z]", blank: "[ \\t]", cntrl: "[\\x00-\\x1F\\x7F]", digit: "\\d", graph: "[\\x21-\\x7E]", lower: "[a-z]", print: "[\\x20-\\x7E]", punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]", space: "\\s", upper: "[A-Z]", xdigit: "[A-Fa-f0-9]" };
  })(w || (w = {}));
  w.prototype = w.PCRE.prototype;
  $.exports = w;
});
var Q = U((N) => {
  "use strict";
  l();
  u();
  d();
  N.parse = Pt;
  N.serialize = vt;
  var bt = Object.prototype.toString, M = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function Pt(t, e) {
    if (typeof t != "string") throw new TypeError("argument str must be a string");
    for (var a = {}, s = e || {}, r = s.decode || St, i = 0; i < t.length; ) {
      var n = t.indexOf("=", i);
      if (n === -1) break;
      var o = t.indexOf(";", i);
      if (o === -1) o = t.length;
      else if (o < n) {
        i = t.lastIndexOf(";", n - 1) + 1;
        continue;
      }
      var c = t.slice(i, n).trim();
      if (a[c] === void 0) {
        var h = t.slice(n + 1, o).trim();
        h.charCodeAt(0) === 34 && (h = h.slice(1, -1)), a[c] = Et(h, r);
      }
      i = o + 1;
    }
    return a;
  }
  __name(Pt, "Pt");
  function vt(t, e, a) {
    var s = a || {}, r = s.encode || kt;
    if (typeof r != "function") throw new TypeError("option encode is invalid");
    if (!M.test(t)) throw new TypeError("argument name is invalid");
    var i = r(e);
    if (i && !M.test(i)) throw new TypeError("argument val is invalid");
    var n = t + "=" + i;
    if (s.maxAge != null) {
      var o = s.maxAge - 0;
      if (isNaN(o) || !isFinite(o)) throw new TypeError("option maxAge is invalid");
      n += "; Max-Age=" + Math.floor(o);
    }
    if (s.domain) {
      if (!M.test(s.domain)) throw new TypeError("option domain is invalid");
      n += "; Domain=" + s.domain;
    }
    if (s.path) {
      if (!M.test(s.path)) throw new TypeError("option path is invalid");
      n += "; Path=" + s.path;
    }
    if (s.expires) {
      var c = s.expires;
      if (!Ct(c) || isNaN(c.valueOf())) throw new TypeError("option expires is invalid");
      n += "; Expires=" + c.toUTCString();
    }
    if (s.httpOnly && (n += "; HttpOnly"), s.secure && (n += "; Secure"), s.priority) {
      var h = typeof s.priority == "string" ? s.priority.toLowerCase() : s.priority;
      switch (h) {
        case "low":
          n += "; Priority=Low";
          break;
        case "medium":
          n += "; Priority=Medium";
          break;
        case "high":
          n += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (s.sameSite) {
      var p = typeof s.sameSite == "string" ? s.sameSite.toLowerCase() : s.sameSite;
      switch (p) {
        case true:
          n += "; SameSite=Strict";
          break;
        case "lax":
          n += "; SameSite=Lax";
          break;
        case "strict":
          n += "; SameSite=Strict";
          break;
        case "none":
          n += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return n;
  }
  __name(vt, "vt");
  function St(t) {
    return t.indexOf("%") !== -1 ? decodeURIComponent(t) : t;
  }
  __name(St, "St");
  function kt(t) {
    return encodeURIComponent(t);
  }
  __name(kt, "kt");
  function Ct(t) {
    return bt.call(t) === "[object Date]" || t instanceof Date;
  }
  __name(Ct, "Ct");
  function Et(t, e) {
    try {
      return e(t);
    } catch {
      return t;
    }
  }
  __name(Et, "Et");
});
l();
u();
d();
l();
u();
d();
l();
u();
d();
var b = "INTERNAL_SUSPENSE_CACHE_HOSTNAME.local";
l();
u();
d();
l();
u();
d();
l();
u();
d();
l();
u();
d();
var D = q(F());
function k(t, e, a) {
  if (e == null) return { match: null, captureGroupKeys: [] };
  let s = a ? "" : "i", r = [];
  return { match: (0, D.default)(`%${t}%${s}`, r).exec(e), captureGroupKeys: r };
}
__name(k, "k");
function P(t, e, a, { namedOnly: s } = {}) {
  return t.replace(/\$([a-zA-Z0-9_]+)/g, (r, i) => {
    let n = a.indexOf(i);
    return s && n === -1 ? r : (n === -1 ? e[parseInt(i, 10)] : e[n + 1]) || "";
  });
}
__name(P, "P");
function j(t, { url: e, cookies: a, headers: s, routeDest: r }) {
  switch (t.type) {
    case "host":
      return { valid: e.hostname === t.value };
    case "header":
      return t.value !== void 0 ? I(t.value, s.get(t.key), r) : { valid: s.has(t.key) };
    case "cookie": {
      let i = a[t.key];
      return i && t.value !== void 0 ? I(t.value, i, r) : { valid: i !== void 0 };
    }
    case "query":
      return t.value !== void 0 ? I(t.value, e.searchParams.get(t.key), r) : { valid: e.searchParams.has(t.key) };
  }
}
__name(j, "j");
function I(t, e, a) {
  let { match: s, captureGroupKeys: r } = k(t, e);
  return a && s && r.length ? { valid: !!s, newRouteDest: P(a, s, r, { namedOnly: true }) } : { valid: !!s };
}
__name(I, "I");
l();
u();
d();
function G(t) {
  let e = new Headers(t.headers);
  return t.cf && (e.set("x-vercel-ip-city", encodeURIComponent(t.cf.city)), e.set("x-vercel-ip-country", t.cf.country), e.set("x-vercel-ip-country-region", t.cf.regionCode), e.set("x-vercel-ip-latitude", t.cf.latitude), e.set("x-vercel-ip-longitude", t.cf.longitude)), e.set("x-vercel-sc-host", b), new Request(t, { headers: e });
}
__name(G, "G");
l();
u();
d();
function x(t, e, a) {
  let s = e instanceof Headers ? e.entries() : Object.entries(e);
  for (let [r, i] of s) {
    let n = r.toLowerCase(), o = a?.match ? P(i, a.match, a.captureGroupKeys) : i;
    n === "set-cookie" ? t.append(n, o) : t.set(n, o);
  }
}
__name(x, "x");
function v(t) {
  return /^https?:\/\//.test(t);
}
__name(v, "v");
function _(t, e) {
  for (let [a, s] of e.entries()) {
    let r = /^nxtP(.+)$/.exec(a), i = /^nxtI(.+)$/.exec(a);
    r?.[1] ? (t.set(a, s), t.set(r[1], s)) : i?.[1] ? t.set(i[1], s.replace(/(\(\.+\))+/, "")) : (!t.has(a) || !!s && !t.getAll(a).includes(s)) && t.append(a, s);
  }
}
__name(_, "_");
function L(t, e) {
  let a = new URL(e, t.url);
  return _(a.searchParams, new URL(t.url).searchParams), a.pathname = a.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(a, t);
}
__name(L, "L");
function S(t) {
  return new Response(t.body, t);
}
__name(S, "S");
function H(t) {
  return t.split(",").map((e) => {
    let [a, s] = e.split(";"), r = parseFloat((s ?? "q=1").replace(/q *= */gi, ""));
    return [a.trim(), isNaN(r) ? 1 : r];
  }).sort((e, a) => a[1] - e[1]).map(([e]) => e === "*" || e === "" ? [] : e).flat();
}
__name(H, "H");
l();
u();
d();
function O(t) {
  switch (t) {
    case "none":
      return "filesystem";
    case "filesystem":
      return "rewrite";
    case "rewrite":
      return "resource";
    case "resource":
      return "miss";
    default:
      return "miss";
  }
}
__name(O, "O");
async function C(t, { request: e, assetsFetcher: a, ctx: s }, { path: r, searchParams: i }) {
  let n, o = new URL(e.url);
  _(o.searchParams, i);
  let c = new Request(o, e);
  try {
    switch (t?.type) {
      case "function":
      case "middleware": {
        let h = await import(t.entrypoint);
        try {
          n = await h.default(c, s);
        } catch (p) {
          let y = p;
          throw y.name === "TypeError" && y.message.endsWith("default is not a function") ? new Error(`An error occurred while evaluating the target edge function (${t.entrypoint})`) : p;
        }
        break;
      }
      case "override": {
        n = S(await a.fetch(L(c, t.path ?? r))), t.headers && x(n.headers, t.headers);
        break;
      }
      case "static": {
        n = await a.fetch(L(c, r));
        break;
      }
      default:
        n = new Response("Not Found", { status: 404 });
    }
  } catch (h) {
    return console.error(h), new Response("Internal Server Error", { status: 500 });
  }
  return S(n);
}
__name(C, "C");
function B(t, e) {
  let a = "^//?(?:", s = ")/(.*)$";
  return !t.startsWith(a) || !t.endsWith(s) ? false : t.slice(a.length, -s.length).split("|").every((i) => e.has(i));
}
__name(B, "B");
l();
u();
d();
function ht(t, { protocol: e, hostname: a, port: s, pathname: r }) {
  return !(e && t.protocol.replace(/:$/, "") !== e || !new RegExp(a).test(t.hostname) || s && !new RegExp(s).test(t.port) || r && !new RegExp(r).test(t.pathname));
}
__name(ht, "ht");
function pt(t, e) {
  if (t.method !== "GET") return;
  let { origin: a, searchParams: s } = new URL(t.url), r = s.get("url"), i = Number.parseInt(s.get("w") ?? "", 10), n = Number.parseInt(s.get("q") ?? "75", 10);
  if (!r || Number.isNaN(i) || Number.isNaN(n) || !e?.sizes?.includes(i) || n < 0 || n > 100) return;
  let o = new URL(r, a);
  if (o.pathname.endsWith(".svg") && !e?.dangerouslyAllowSVG) return;
  let c = r.startsWith("//"), h = r.startsWith("/") && !c;
  if (!h && !e?.domains?.includes(o.hostname) && !e?.remotePatterns?.find((R) => ht(o, R))) return;
  let p = t.headers.get("Accept") ?? "", y = e?.formats?.find((R) => p.includes(R))?.replace("image/", "");
  return { isRelative: h, imageUrl: o, options: { width: i, quality: n, format: y } };
}
__name(pt, "pt");
function ft(t, e, a) {
  let s = new Headers();
  if (a?.contentSecurityPolicy && s.set("Content-Security-Policy", a.contentSecurityPolicy), a?.contentDispositionType) {
    let i = e.pathname.split("/").pop(), n = i ? `${a.contentDispositionType}; filename="${i}"` : a.contentDispositionType;
    s.set("Content-Disposition", n);
  }
  t.headers.has("Cache-Control") || s.set("Cache-Control", `public, max-age=${a?.minimumCacheTTL ?? 60}`);
  let r = S(t);
  return x(r.headers, s), r;
}
__name(ft, "ft");
async function K(t, { buildOutput: e, assetsFetcher: a, imagesConfig: s }) {
  let r = pt(t, s);
  if (!r) return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: i, imageUrl: n } = r, c = await (i && n.pathname in e ? a.fetch.bind(a) : fetch)(n);
  return ft(c, n, s);
}
__name(K, "K");
l();
u();
d();
l();
u();
d();
l();
u();
d();
async function E(t) {
  return import(t);
}
__name(E, "E");
var mt = "x-vercel-cache-tags";
var gt = "x-next-cache-soft-tags";
var yt = Symbol.for("__cloudflare-request-context__");
async function J(t) {
  let e = `https://${b}/v1/suspense-cache/`;
  if (!t.url.startsWith(e)) return null;
  try {
    let a = new URL(t.url), s = await xt();
    if (a.pathname === "/v1/suspense-cache/revalidate") {
      let i = a.searchParams.get("tags")?.split(",") ?? [];
      for (let n of i) await s.revalidateTag(n);
      return new Response(null, { status: 200 });
    }
    let r = a.pathname.replace("/v1/suspense-cache/", "");
    if (!r.length) return new Response("Invalid cache key", { status: 400 });
    switch (t.method) {
      case "GET": {
        let i = z(t, gt), n = await s.get(r, { softTags: i });
        return n ? new Response(JSON.stringify(n.value), { status: 200, headers: { "Content-Type": "application/json", "x-vercel-cache-state": "fresh", age: `${(Date.now() - (n.lastModified ?? Date.now())) / 1e3}` } }) : new Response(null, { status: 404 });
      }
      case "POST": {
        let i = globalThis[yt], n = /* @__PURE__ */ __name(async () => {
          let o = await t.json();
          o.data.tags === void 0 && (o.tags ??= z(t, mt) ?? []), await s.set(r, o);
        }, "n");
        return i ? i.ctx.waitUntil(n()) : await n(), new Response(null, { status: 200 });
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (a) {
    return console.error(a), new Response("Error handling cache request", { status: 500 });
  }
}
__name(J, "J");
async function xt() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? W("kv") : W("cache-api");
}
__name(xt, "xt");
async function W(t) {
  let e = `./__next-on-pages-dist__/cache/${t}.js`, a = await E(e);
  return new a.default();
}
__name(W, "W");
function z(t, e) {
  return t.headers.get(e)?.split(",")?.filter(Boolean);
}
__name(z, "z");
function X() {
  globalThis[Z] || (_t(), globalThis[Z] = true);
}
__name(X, "X");
function _t() {
  let t = globalThis.fetch;
  globalThis.fetch = async (...e) => {
    let a = new Request(...e), s = await wt(a);
    return s || (s = await J(a), s) ? s : (Rt(a), t(a));
  };
}
__name(_t, "_t");
async function wt(t) {
  if (t.url.startsWith("blob:")) try {
    let a = `./__next-on-pages-dist__/assets/${new URL(t.url).pathname}.bin`, s = (await E(a)).default, r = { async arrayBuffer() {
      return s;
    }, get body() {
      return new ReadableStream({ start(i) {
        let n = Buffer.from(s);
        i.enqueue(n), i.close();
      } });
    }, async text() {
      return Buffer.from(s).toString();
    }, async json() {
      let i = Buffer.from(s);
      return JSON.stringify(i.toString());
    }, async blob() {
      return new Blob(s);
    } };
    return r.clone = () => ({ ...r }), r;
  } catch {
  }
  return null;
}
__name(wt, "wt");
function Rt(t) {
  t.headers.has("user-agent") || t.headers.set("user-agent", "Next.js Middleware");
}
__name(Rt, "Rt");
var Z = Symbol.for("next-on-pages fetch patch");
l();
u();
d();
var Y = q(Q());
var T = class {
  static {
    __name(this, "T");
  }
  constructor(e, a, s, r, i) {
    this.routes = e;
    this.output = a;
    this.reqCtx = s;
    this.url = new URL(s.request.url), this.cookies = (0, Y.parse)(s.request.headers.get("cookie") || ""), this.path = this.url.pathname || "/", this.headers = { normal: new Headers(), important: new Headers() }, this.searchParams = new URLSearchParams(), _(this.searchParams, this.url.searchParams), this.checkPhaseCounter = 0, this.middlewareInvoked = [], this.wildcardMatch = i?.find((n) => n.domain === this.url.hostname), this.locales = new Set(r.collectedLocales);
  }
  url;
  cookies;
  wildcardMatch;
  path;
  status;
  headers;
  searchParams;
  body;
  checkPhaseCounter;
  middlewareInvoked;
  locales;
  checkRouteMatch(e, { checkStatus: a, checkIntercept: s }) {
    let r = k(e.src, this.path, e.caseSensitive);
    if (!r.match || e.methods && !e.methods.map((n) => n.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase())) return;
    let i = { url: this.url, cookies: this.cookies, headers: this.reqCtx.request.headers, routeDest: e.dest };
    if (!e.has?.find((n) => {
      let o = j(n, i);
      return o.newRouteDest && (i.routeDest = o.newRouteDest), !o.valid;
    }) && !e.missing?.find((n) => j(n, i).valid) && !(a && e.status !== this.status)) {
      if (s && e.dest) {
        let n = /\/(\(\.+\))+/, o = n.test(e.dest), c = n.test(this.path);
        if (o && !c) return;
      }
      return { routeMatch: r, routeDest: i.routeDest };
    }
  }
  processMiddlewareResp(e) {
    let a = "x-middleware-override-headers", s = e.headers.get(a);
    if (s) {
      let c = new Set(s.split(",").map((h) => h.trim()));
      for (let h of c.keys()) {
        let p = `x-middleware-request-${h}`, y = e.headers.get(p);
        this.reqCtx.request.headers.get(h) !== y && (y ? this.reqCtx.request.headers.set(h, y) : this.reqCtx.request.headers.delete(h)), e.headers.delete(p);
      }
      e.headers.delete(a);
    }
    let r = "x-middleware-rewrite", i = e.headers.get(r);
    if (i) {
      let c = new URL(i, this.url), h = this.url.hostname !== c.hostname;
      this.path = h ? `${c}` : c.pathname, _(this.searchParams, c.searchParams), e.headers.delete(r);
    }
    let n = "x-middleware-next";
    e.headers.get(n) ? e.headers.delete(n) : !i && !e.headers.has("location") ? (this.body = e.body, this.status = e.status) : e.headers.has("location") && e.status >= 300 && e.status < 400 && (this.status = e.status), x(this.reqCtx.request.headers, e.headers), x(this.headers.normal, e.headers), this.headers.middlewareLocation = e.headers.get("location");
  }
  async runRouteMiddleware(e) {
    if (!e) return true;
    let a = e && this.output[e];
    if (!a || a.type !== "middleware") return this.status = 500, false;
    let s = await C(a, this.reqCtx, { path: this.path, searchParams: this.searchParams, headers: this.headers, status: this.status });
    return this.middlewareInvoked.push(e), s.status === 500 ? (this.status = s.status, false) : (this.processMiddlewareResp(s), true);
  }
  applyRouteOverrides(e) {
    !e.override || (this.status = void 0, this.headers.normal = new Headers(), this.headers.important = new Headers());
  }
  applyRouteHeaders(e, a, s) {
    !e.headers || (x(this.headers.normal, e.headers, { match: a, captureGroupKeys: s }), e.important && x(this.headers.important, e.headers, { match: a, captureGroupKeys: s }));
  }
  applyRouteStatus(e) {
    !e.status || (this.status = e.status);
  }
  applyRouteDest(e, a, s) {
    if (!e.dest) return this.path;
    let r = this.path, i = e.dest;
    this.wildcardMatch && /\$wildcard/.test(i) && (i = i.replace(/\$wildcard/g, this.wildcardMatch.value)), this.path = P(i, a, s);
    let n = /\/index\.rsc$/i.test(this.path), o = /^\/(?:index)?$/i.test(r), c = /^\/__index\.prefetch\.rsc$/i.test(r);
    n && !o && !c && (this.path = r);
    let h = /\.rsc$/i.test(this.path), p = /\.prefetch\.rsc$/i.test(this.path), y = this.path in this.output;
    h && !p && !y && (this.path = this.path.replace(/\.rsc/i, ""));
    let R = new URL(this.path, this.url);
    return _(this.searchParams, R.searchParams), v(this.path) || (this.path = R.pathname), r;
  }
  applyLocaleRedirects(e) {
    if (!e.locale?.redirect || !/^\^(.)*$/.test(e.src) && e.src !== this.path || this.headers.normal.has("location")) return;
    let { locale: { redirect: s, cookie: r } } = e, i = r && this.cookies[r], n = H(i ?? ""), o = H(this.reqCtx.request.headers.get("accept-language") ?? ""), p = [...n, ...o].map((y) => s[y]).filter(Boolean)[0];
    if (p) {
      !this.path.startsWith(p) && (this.headers.normal.set("location", p), this.status = 307);
      return;
    }
  }
  getLocaleFriendlyRoute(e, a) {
    return !this.locales || a !== "miss" ? e : B(e.src, this.locales) ? { ...e, src: e.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$") } : e;
  }
  async checkRoute(e, a) {
    let s = this.getLocaleFriendlyRoute(a, e), { routeMatch: r, routeDest: i } = this.checkRouteMatch(s, { checkStatus: e === "error", checkIntercept: e === "rewrite" }) ?? {}, n = { ...s, dest: i };
    if (!r?.match || n.middlewarePath && this.middlewareInvoked.includes(n.middlewarePath)) return "skip";
    let { match: o, captureGroupKeys: c } = r;
    if (this.applyRouteOverrides(n), this.applyLocaleRedirects(n), !await this.runRouteMiddleware(n.middlewarePath)) return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation) return "done";
    this.applyRouteHeaders(n, o, c), this.applyRouteStatus(n);
    let p = this.applyRouteDest(n, o, c);
    if (n.check && !v(this.path)) if (p === this.path) {
      if (e !== "miss") return this.checkPhase(O(e));
      this.status = 404;
    } else if (e === "miss") {
      if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output)) return this.checkPhase("filesystem");
      this.status === 404 && (this.status = void 0);
    } else return this.checkPhase("none");
    return !n.continue || n.status && n.status >= 300 && n.status <= 399 ? "done" : "next";
  }
  async checkPhase(e) {
    if (this.checkPhaseCounter++ >= 50) return console.error(`Routing encountered an infinite loop while checking ${this.url.pathname}`), this.status = 500, "error";
    this.middlewareInvoked = [];
    let a = true;
    for (let i of this.routes[e]) {
      let n = await this.checkRoute(e, i);
      if (n === "error") return "error";
      if (n === "done") {
        a = false;
        break;
      }
    }
    if (e === "hit" || v(this.path) || this.headers.normal.has("location") || !!this.body) return "done";
    if (e === "none") for (let i of this.locales) {
      let n = new RegExp(`/${i}(/.*)`), c = this.path.match(n)?.[1];
      if (c && c in this.output) {
        this.path = c;
        break;
      }
    }
    let s = this.path in this.output;
    if (!s && this.path.endsWith("/")) {
      let i = this.path.replace(/\/$/, "");
      s = i in this.output, s && (this.path = i);
    }
    if (e === "miss" && !s) {
      let i = !this.status || this.status < 400;
      this.status = i ? 404 : this.status;
    }
    let r = "miss";
    return s || e === "miss" || e === "error" ? r = "hit" : a && (r = O(e)), this.checkPhase(r);
  }
  async run(e = "none") {
    this.checkPhaseCounter = 0;
    let a = await this.checkPhase(e);
    return this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400) && (this.status = 307), a;
  }
};
async function tt(t, e, a, s) {
  let r = new T(e.routes, a, t, s, e.wildcard), i = await et(r);
  return Mt(t, i, a);
}
__name(tt, "tt");
async function et(t, e = "none", a = false) {
  return await t.run(e) === "error" || !a && t.status && t.status >= 400 ? et(t, "error", true) : { path: t.path, status: t.status, headers: t.headers, searchParams: t.searchParams, body: t.body };
}
__name(et, "et");
async function Mt(t, { path: e = "/404", status: a, headers: s, searchParams: r, body: i }, n) {
  let o = s.normal.get("location");
  if (o) {
    if (o !== s.middlewareLocation) {
      let p = [...r.keys()].length ? `?${r.toString()}` : "";
      s.normal.set("location", `${o ?? "/"}${p}`);
    }
    return new Response(null, { status: a, headers: s.normal });
  }
  let c;
  if (i !== void 0) c = new Response(i, { status: a });
  else if (v(e)) {
    let p = new URL(e);
    _(p.searchParams, r), c = await fetch(p, t.request);
  } else c = await C(n[e], t, { path: e, status: a, headers: s, searchParams: r });
  let h = s.normal;
  return x(h, c.headers), x(h, s.important), c = new Response(c.body, { ...c, status: a || c.status, headers: h }), c;
}
__name(Mt, "Mt");
l();
u();
d();
function st() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: Tt };
}
__name(st, "st");
function Tt(t) {
  let e = globalThis.__nextOnPagesRoutesIsolation._map.get(t);
  if (e) return e;
  let a = At();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(t, a), a;
}
__name(Tt, "Tt");
function At() {
  let t = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: /* @__PURE__ */ __name((e, a) => t.has(a) ? t.get(a) : Reflect.get(globalThis, a), "get"), set: /* @__PURE__ */ __name((e, a, s) => It.has(a) ? Reflect.set(globalThis, a, s) : (t.set(a, s), true), "set") });
}
__name(At, "At");
var It = /* @__PURE__ */ new Set(["_nextOriginalFetch", "fetch", "__incrementalCache"]);
var jt = Object.defineProperty;
var Lt = /* @__PURE__ */ __name((...t) => {
  let e = t[0], a = t[1], s = "__import_unsupported";
  if (!(a === s && typeof e == "object" && e !== null && s in e)) return jt(...t);
}, "Lt");
globalThis.Object.defineProperty = Lt;
globalThis.AbortController = class extends AbortController {
  constructor() {
    try {
      super();
    } catch (e) {
      if (e instanceof Error && e.message.includes("Disallowed operation called within global scope")) return { signal: { aborted: false, reason: null, onabort: /* @__PURE__ */ __name(() => {
      }, "onabort"), throwIfAborted: /* @__PURE__ */ __name(() => {
      }, "throwIfAborted") }, abort() {
      } };
      throw e;
    }
  }
};
var Ss = { async fetch(t, e, a) {
  st(), X();
  let s = await __ALSes_PROMISE__;
  if (!s) {
    let n = new URL(t.url), o = await e.ASSETS.fetch(`${n.protocol}//${n.host}/cdn-cgi/errors/no-nodejs_compat.html`), c = o.ok ? o.body : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
    return new Response(c, { status: 503 });
  }
  let { envAsyncLocalStorage: r, requestContextAsyncLocalStorage: i } = s;
  return r.run({ ...e, NODE_ENV: "production", SUSPENSE_CACHE_URL: b }, async () => i.run({ env: e, ctx: a, cf: t.cf }, async () => {
    if (new URL(t.url).pathname.startsWith("/_next/image")) return K(t, { buildOutput: m, assetsFetcher: e.ASSETS, imagesConfig: f.images });
    let o = G(t);
    return tt({ request: o, ctx: a, assetsFetcher: e.ASSETS }, f, m, g);
  }));
} };
export {
  Ss as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=bundledWorker-0.22130926035217358.mjs.map
