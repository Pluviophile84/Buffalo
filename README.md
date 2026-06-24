# Buffalo ($BUFF) production website

Static, dependency-light pre-launch site. The public page remains safely in pre-launch mode until a live contract and explorer are deliberately configured.

## The only launch file to edit

Open:

`assets/js/site-config.js`

You do **not** remove pre-launch text manually from `index.html`. The page contains paired pre-launch/live elements, and JavaScript switches them automatically from the configuration.

### Before launch

Keep:

```js
status: 'prelaunch',
```

You may already add official social links. Contract, explorer, and transaction controls remain safely unavailable.

### At launch

Change and fill these fields:

```js
status: 'live',
contractAddress: 'FULL_OFFICIAL_CONTRACT_ADDRESS',
explorerUrl: 'https://EXPLORER_URL_FOR_THE_CONTRACT',
buyUrl: 'https://OFFICIAL_BUY_URL',
xUrl: 'https://x.com/OFFICIAL_ACCOUNT',
telegramUrl: 'https://t.me/OFFICIAL_COMMUNITY',
siteUrl: 'https://YOUR_FINAL_DOMAIN',
```

The page leaves pre-launch mode only when all three conditions are true:

1. `status` is exactly `'live'`.
2. `contractAddress` is not empty.
3. `explorerUrl` is not empty.

`buyUrl` is not required to switch the whole site live, but Buy controls remain pending until it is added. The mobile-menu Buy button links to the internal How to Buy section before launch and changes to the official `buyUrl` after launch.

The site will not enter live mode unless both `contractAddress` and `explorerUrl` are present. This guard lets you prefill other fields without accidentally publishing a live contract state.

Optional but strongly recommended after on-chain verification:

- `totalSupply`
- `mintAuthority`
- `freezeAuthority`
- `teamAllocation`

Unset live facts display as `Pending verification` rather than making an unsupported claim.

`launchDate` accepts an ISO date such as `2026-07-15T16:00:00Z`. When supplied during pre-launch, the countdown appears automatically.

## Deployment

Upload the **contents** of this folder to the root of any static host. Serve it over HTTPS.

Netlify reads the included `_headers` file automatically. On Vercel, Cloudflare Pages, S3/CloudFront, or another host, translate those headers into the platform's equivalent configuration.

The package includes:

- Content Security Policy and other security headers
- Cache rules for immutable imagery and changeable launch configuration
- Responsive desktop/mobile layouts
- Accessible mobile navigation and keyboard behavior
- Contract-copy fallback and screen-reader announcements
- Open Graph artwork, icons, manifest, and robots file
- No wallet connector, analytics tracker, or third-party application script

## Domain and social cards

Set `siteUrl` in `site-config.js`. The browser then creates the canonical URL and absolute Open Graph image URL.

For maximum compatibility with crawlers that do not execute JavaScript, also configure your deployment/build system to output the final absolute canonical URL and Open Graph image URL in `index.html`.

Social image:

`assets/images/og-buffalo.jpg`

## Protected hero composition

The hero intentionally preserves the original full-viewport composition at every breakpoint: centered word arrangement, watermark scale and masking, engraving texture, original buttons, contract module, scroll cue, and original typography. Launch-state information is handled by the navigation, status strip, verification section, and configuration system so the hero does not need to be redesigned.

## Pre-launch behavior

- The original hero keeps its `[CONTRACT ADDRESS]` placeholder until launch; verification panels read `Published at launch`.
- Contract-copy controls are disabled.
- Explorer and buy controls have no destination and cannot be focused.
- Launch-dependent facts are clearly pending.
- A token without the contract shown on this site is explicitly described as unofficial.
- Social links can be enabled before launch without exposing the contract or transaction links.

## Final launch checklist

1. Confirm the contract against the explorer character for character.
2. Open every configured URL in a clean browser profile.
3. Verify supply, authorities, and allocation claims on-chain.
4. Confirm the final domain and social-preview card.
5. Test a real contract copy over HTTPS.
6. Test at 320 px, 375 px, tablet, laptop, and wide desktop widths.
7. Run Lighthouse and an accessibility scanner against the deployed URL.
8. Publish the same domain and contract through every official social account.

## Historical assets

See `ASSET-SOURCES.md` for image provenance and deployment cautions.
