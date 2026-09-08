# GREA's Anatomy

An interactive 3D anatomy explorer built with React, Three.js, and shadcn/ui. Take the BodyParts3D adult male reference apart into **2,234 individually selectable meshes**, explore **15 anatomical systems**, and search **3,432 named concepts**.

**[Explore the live demo](https://grea-anatomy.pages.dev)**

## Explore

- Orbit, zoom, and select structures directly on the body.
- Toggle individual systems or use skeleton and organ presets.
- Move from assembled anatomy to a spaced inventory of every visible piece.
- Search anatomical names and source identifiers.
- Isolate a selected structure and read its details.
- Use compact controls and detail panels on mobile.
- **Ask the expert** — a free in-app explainer that knows the app and the anatomy.

## Run locally

Requires Node.js 22.13 or newer. No API keys or accounts are needed.

```sh
npm ci
npm run dev
```

Open http://localhost:3016. To build the static site, run `npm run build`; the output is in `dist/`.

## Mobile apps

The app ships as a Capacitor iOS and Android app that loads the live site from Cloudflare Pages:

- **iOS**: `ios/App/App.xcodeproj`, target `GREAsAnatomy`, bundle ID `com.grea.greasanatomy`
- **Android**: `android/`, application ID `com.grea.greasanatomy`

Both platforms load `https://human-atlas-temp.pages.dev` as the web view source.

### iOS

```sh
npx cap sync ios
# Open ios/App/App.xcodeproj in Xcode, select a simulator, and build/run.
xcodebuild -project ios/App/App.xcodeproj -scheme GREAsAnatomy \
  -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 17' build
```

### Android

Requires the Android SDK. Place it at `$ANDROID_HOME` (or set `local.properties`), then:

```sh
npx cap sync android
cd android && ./gradlew build
```

CI (GitHub Actions) can build the Android APK/AAB without a local SDK — see `.github/workflows/android.yml`.

## Validate

```sh
npm run check
node scripts/validate-atlas.mjs
node scripts/validate-interactions.mjs
npm run build
```

Validation covers mesh buffers, names and concept membership, nonoverlapping exploded layouts at desktop and mobile aspect ratios, search and inspection contracts, and tap-versus-drag handling. Browser interaction checks have exercised selection, system controls, search, isolation, rotation, and 390×844, 320×568, and 844×390 layouts. Phone controls stay clear of the exploded inventory, and isolated structures fit the space above or beside the detail panel. Physical-device performance and real multitouch hardware have not been tested.

## Anatomy data

The current viewer uses **BodyParts3D 4.0**, an adult male reference anatomy, licensed **CC BY 4.0**. It does not represent every human structure or variation. Individual source meshes are distinct from named concepts, which may group multiple meshes. Descriptions distinguish general system context from individual organ explanations.

Geometry is simplified for browser performance while retaining every source mesh. The packaged model contains 2,288,268 triangles and downloads approximately 33 MB of compressed geometry. Full credits, source links, and adaptation details are in [ATTRIBUTION.md](public/ATTRIBUTION.md).

This is an educational explorer, not a diagnostic or surgical tool.

## How it works

Geometry is merged into batches. Per-structure GPU textures control translation, visibility, and selection, while component geometry supports accurate picking. Exploded layouts pack only the visible pieces. Rendering updates when the scene changes; orbit controls remain responsive without thousands of separate draw calls.

The optional WebMCP tools expose anatomy search and inspection in compatible browsers. The visible interface works without them.

## Rebuilding geometry

The repository includes browser-ready geometry. Rebuilding it is optional: obtain the official BodyParts3D OBJ archive and English metadata tables, prepare the joined concepts and display-system mappings, run `scripts/convert-anatomy.py`, then `node scripts/optimize-anatomy.mjs` and `node scripts/compress-models.mjs`. Simplification uses a 0.2% relative error limit per structure.

## Deploy

The web app is deployed to Cloudflare Pages via `wrangler`:

```sh
npx wrangler pages deploy dist --project-name grea-anatomy
npx wrangler pages deploy dist --project-name human-atlas-temp
```

- `grea-anatomy.pages.dev` — production project
- `human-atlas-temp.pages.dev` — production project (what the iOS/Android apps load)

## License

Original application code is released under the [MIT License](LICENSE). **The anatomy data has its own CC BY 4.0 license**; preserve the attribution when redistributing it. Third-party dependencies retain their respective licenses.

Issues and pull requests are welcome. Please include reproduction steps and browser/device details for interaction problems.
