# CS2 Callouts

Personal callout reference for CS2 & CS:GO maps.  
Hosted at **cs.thcprophet.eu/callouts** via Netlify.  
Minimap images served from **cnd.thaprophet.eu** via Cloudflare R2.

## First-time setup

### 1. Install dependencies
```bash
npm install
```

### 2. Download & upload minimap images to R2 (run once)
```bash
node scripts/download-maps.mjs
```
This saves 11 PNGs into `downloaded-maps/`. Then upload them to your R2 bucket:

**Via Wrangler CLI:**
```bash
for f in downloaded-maps/*.png; do
  wrangler r2 object put YOUR_BUCKET/images/cs2/minimaps/$(basename $f) \
    --file "$f" --content-type image/png
done
```
**Or** drag-and-drop via the Cloudflare R2 dashboard into `images/cs2/minimaps/`.

The images must be publicly accessible at:
```
https://cnd.thaprophet.eu/images/cs2/minimaps/ancient.png
https://cnd.thaprophet.eu/images/cs2/minimaps/dust2.png
... (etc.)
```

### 3. Build
```bash
npm run build
```

### 4. Deploy to Netlify
- Connect the repo in the Netlify dashboard
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- The `netlify.toml` and `public/_redirects` handle SPA routing automatically.

### Domain setup (cs.thcprophet.eu)
Add a CNAME for `cs` → `your-site.netlify.app`, then add the custom domain in Netlify.

The site root (`/`) auto-redirects to `/callouts`.

## Updating the CDN URL
The CDN base URL is a single constant at the top of `src/data/callouts.js`:
```js
const CDN = "https://cnd.thaprophet.eu/images/cs2/minimaps";
```
Change it there and all 11 map images update instantly.

## Structure
```
src/
  data/callouts.js   ← all map + callout data, CDN URL constant at top
  pages/
    IndexPage.jsx
    MapPage.jsx
  App.jsx
scripts/
  download-maps.mjs  ← download from totalcsgo → upload to R2
public/
  favicon.svg        ← only asset NOT on CDN (self-contained SVG)
  _redirects         ← Netlify SPA catch-all
netlify.toml
```
