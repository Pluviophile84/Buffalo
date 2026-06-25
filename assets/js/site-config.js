/**
 * BUFFALO LAUNCH CONFIGURATION
 * This is the only file you need to edit for launch.
 *
 * PRE-LAUNCH:
 *   status: 'prelaunch'
 *
 * LIVE:
 *   1. Change status to 'live'.
 *   2. Add contractAddress and explorerUrl (both are required to leave pre-launch mode).
 *   3. Add buyUrl and official social links.
 *
 * The website automatically hides pre-launch wording and reveals the live wording.
 * Do not delete pre-launch HTML manually.
 */
window.BUFFALO_CONFIG = Object.freeze({
  status: 'prelaunch', // use exactly 'prelaunch' or 'live'

  contractAddress: '', // full official token contract address
  explorerUrl: '',     // direct explorer page for that exact contract
  buyUrl: '',          // official Pump.fun or DEX purchase page

  xUrl: '',            // official X account
  telegramUrl: '',     // optional official Telegram/community link
  siteUrl: '',         // final public site URL, e.g. 'https://buffalo.example'

  launchDate: '',      // optional ISO date, e.g. '2026-07-15T16:00:00Z'
  network: 'Solana',
  launchPlatform: 'Pump.fun',

  // Add these only after you have verified them on-chain.
  totalSupply: '',
  mintAuthority: '',
  freezeAuthority: '',
  teamAllocation: ''
});
