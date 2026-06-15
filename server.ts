import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import http from 'https';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add JSON parsing middleware
  app.use(express.json());

  // API Proxy for coordinate lookup to bypass CORS
  app.get("/api/proxy/zone", async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: "Missing lat/lng" });

    // Try multiple endpoints for reliability
    const urls = [
      `https://api.azanpro.com/zone/locate?lat=${lat}&lon=${lng}`,
      `https://mpt.i906.my/mpt/prayer/coordinate?lat=${lat}&lng=${lng}`,
      `https://mpt.i906.my/api/prayer/coordinate?lat=${lat}&lng=${lng}`,
      `https://mpt.i906.my/prayer/coordinate?lat=${lat}&lng=${lng}`
    ];

    for (const url of urls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          // AzanPro returns { status: true, zone: "SGR01" }
          // MPT v1 returns { status: "OK", data: { zone: "SGR01", ... } }
          
          let zone = null;
          if (data.zone) {
            zone = data.zone;
          } else if (data.data?.zone) {
            zone = data.data.zone;
          } else if (data.code) {
            zone = data.code;
          }

          if (zone && typeof zone === 'string') {
            return res.json({ zone });
          }
        }
        console.warn(`Zone API endpoint failed (${response.status}): ${url}`);
      } catch (error) {
        console.warn(`Zone API endpoint error: ${url}`, error);
      }
    }

    // Fallback: This will trigger the client-side distance fallback
    res.status(404).json({ error: "Zone not found via APIs" });
  });

  // API Proxy for Solat Times (api.waktusolat.app)
  app.get("/api/proxy/solat/:zone", async (req, res) => {
    const { zone } = req.params;
    const url = `https://api.waktusolat.app/v2/solat/${zone}`;
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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

  // API Proxy for Hadis (hadeethenc.com)
  app.get("/api/proxy/hadis/*", async (req, res) => {
    let apiPath = req.params[0];
    const queryParams = new URLSearchParams(req.query as any).toString();
    
    // hadeethenc.com API v1 requires a trailing slash for endpoints like list and one
    // before the query string, otherwise it returns a 404
    let normalizedPath = apiPath;
    if ((normalizedPath.includes('list') || normalizedPath.includes('one')) && !normalizedPath.endsWith('/')) {
      normalizedPath += '/';
    }

    const url = `https://hadeethenc.com/api/v1/${normalizedPath}${queryParams ? '?' + queryParams : ''}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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

  // API Proxy for Al-Quran Cloud (api.alquran.cloud)
  app.get("/api/proxy/quran/*", async (req, res) => {
    const path = req.params[0];
    const query = new URLSearchParams(req.query as any).toString();
    const url = `https://api.alquran.cloud/v1/${path}${query ? '?' + query : ''}`;
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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

  // API Proxy for Overpass (Mosque finder)
  app.post("/api/proxy/overpass", async (req, res) => {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: "Missing query data" });

    const endpoints = [
      'https://overpass-api.de/api/interpreter',
      'https://lz4.overpass-api.de/api/interpreter',
      'https://z.overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter'
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

        const response = await fetch(url, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
