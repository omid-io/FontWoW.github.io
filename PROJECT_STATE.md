# Project State — FontWoW (Studio Integration & Web Deployment)

## Active Milestone
**Milestone 3 (COMPLETE & VERIFIED)**: Web Runtime Crash Resolution (TDZ fix), Subpath Asset Path Normalization, GitHub Pages Live Deployment, and Visual Verification.

## Active Branches & Fork Navigation
- **`main`**: Production branch containing all innovations, canvas effects, Android Native UX wiring, and web subpath fixes.
- **Direct GitHub Repo**: https://github.com/omid-io/FontWoW.github.io
- **Live GitHub Pages Web App**: https://omid-io.github.io/FontWoW.github.io/
- **Live Web Editor Route**: https://omid-io.github.io/FontWoW.github.io/#/app

## Release Artifacts
- **GitHub Release**: https://github.com/omid-io/FontWoW.github.io/releases/tag/v1.6.4-studio.1
- **Installable APK**: `FontWoW-v1.6.2.apk` (connected to in-app update checker and landing page)

## Completed in this Turn
1. **TDZ Runtime Crash Resolved**:
   - Hoisted `t = useCallback(...)` to line 494 above `useEffect(registerHardwareBackHandler)` in [src/App.jsx](file:///e:/programming/FontWoW/src/App.jsx), eliminating the `ReferenceError: Cannot access 'y' before initialization`.
2. **Subpath Asset Path Normalization**:
   - Converted absolute root paths (`/icons/...`, `/docs/...`, `/donations.json`, `/favicon.svg`, `/goals/...`) into relative paths (`./`) across [src/Landing.jsx](file:///e:/programming/FontWoW/src/Landing.jsx), [src/goals.js](file:///e:/programming/FontWoW/src/goals.js), [src/App.jsx](file:///e:/programming/FontWoW/src/App.jsx), and [public/manifest.webmanifest](file:///e:/programming/FontWoW/public/manifest.webmanifest).
3. **GitHub Pages Deployment Verified**:
   - Triggered and verified GitHub Actions deployment workflow `#34065477877` (build in 39s, deploy in 9s).
4. **Empirical Headless Browser Verification**:
   - Inspected live application on `https://omid-io.github.io/FontWoW.github.io/` and `https://omid-io.github.io/FontWoW.github.io/#/app`.
   - Verified all 22 network requests returned `200 OK` (assets, icons, fonts, CSS, JS, donations).
   - Verified zero console errors.
   - Captured visual screenshot proof showing responsive dark UI, canvas quick bar, font size slider, and toolbar.

## Modified Files Index
- [src/App.jsx](file:///e:/programming/FontWoW/src/App.jsx#L494) — TDZ hoisting and relative donations endpoint
- [src/Landing.jsx](file:///e:/programming/FontWoW/src/Landing.jsx#L113) — Relative favicon, donations, and screenshot paths
- [src/goals.js](file:///e:/programming/FontWoW/src/goals.js#L9) — Relative goal SVG paths
- [public/manifest.webmanifest](file:///e:/programming/FontWoW/public/manifest.webmanifest#L5) — Relative manifest scope, start_url, and icon paths

## Immediate Next Steps
1. Verify APK installation on target Android device.
2. Prepare isolated branch for upstream Pull Request to `FontWoW/FontWoW.github.io`.
