var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/proxy/zone", async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: "Missing lat/lng" });
    const urls = [
      `https://api.azanpro.com/zone/locate?lat=${lat}&lon=${lng}`,
      `https://mpt.i906.my/mpt/prayer/coordinate?lat=${lat}&lng=${lng}`,
      `https://mpt.i906.my/api/prayer/coordinate?lat=${lat}&lng=${lng}`,
      `https://mpt.i906.my/prayer/coordinate?lat=${lat}&lng=${lng}`
    ];
    for (const url of urls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8e3);
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          }
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          let zone = null;
          if (data.zone) {
            zone = data.zone;
          } else if (data.data?.zone) {
            zone = data.data.zone;
          } else if (data.code) {
            zone = data.code;
          }
          if (zone && typeof zone === "string") {
            return res.json({ zone });
          }
        }
        console.warn(`Zone API endpoint failed (${response.status}): ${url}`);
      } catch (error) {
        console.warn(`Zone API endpoint error: ${url}`, error);
      }
    }
    res.status(404).json({ error: "Zone not found via APIs" });
  });
  app.get("/api/proxy/solat/:zone", async (req, res) => {
    const { zone } = req.params;
    const url = `https://api.waktusolat.app/v2/solat/${zone}`;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (!response.ok) {
        const text = await response.text();
        console.error(`Solat API error ${response.status}: ${text.slice(0, 100)}`);
        return res.status(response.status).json({ error: "Upstream API error" });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Solat Proxy error:", error);
      res.status(500).json({ error: "Upstream API internal error" });
    }
  });
  app.get("/api/proxy/hadis/*", async (req, res) => {
    let apiPath = req.params[0];
    const queryParams = new URLSearchParams(req.query).toString();
    let normalizedPath = apiPath;
    if ((normalizedPath.includes("list") || normalizedPath.includes("one")) && !normalizedPath.endsWith("/")) {
      normalizedPath += "/";
    }
    const url = `https://hadeethenc.com/api/v1/${normalizedPath}${queryParams ? "?" + queryParams : ""}`;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (!response.ok) {
        const text = await response.text();
        console.error(`Hadis API error ${response.status} for ${url}: ${text.slice(0, 100)}`);
        return res.status(response.status).json({ error: "Upstream API error" });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Hadis Proxy error:", error);
      res.status(500).json({ error: "Upstream API internal error" });
    }
  });
  app.get("/api/proxy/quran/*", async (req, res) => {
    const path2 = req.params[0];
    const query = new URLSearchParams(req.query).toString();
    const url = `https://api.alquran.cloud/v1/${path2}${query ? "?" + query : ""}`;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (!response.ok) {
        const text = await response.text();
        console.error(`Quran API error ${response.status}: ${text.slice(0, 100)}`);
        return res.status(response.status).json({ error: "Upstream API error" });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Quran Proxy error:", error);
      res.status(500).json({ error: "Upstream API internal error" });
    }
  });
  app.post("/api/proxy/overpass", async (req, res) => {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: "Missing query data" });
    const endpoints = [
      "https://overpass-api.de/api/interpreter",
      "https://lz4.overpass-api.de/api/interpreter",
      "https://z.overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter"
    ];
    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2e4);
        const response = await fetch(url, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          },
          body: `data=${encodeURIComponent(data)}`
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const result = await response.json();
          return res.json(result);
        }
        console.warn(`Overpass API endpoint failed (${response.status}): ${url}`);
      } catch (error) {
        console.warn(`Overpass Proxy error for ${url}:`, error);
      }
    }
    res.status(504).json({ error: "All Overpass endpoints timed out or failed" });
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
