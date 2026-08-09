# Pastel Valorant Rank Widget

A hosted OBS browser-source widget with five coordinated pastel palettes. It displays live Valorant rank, RR, K/D, wins, losses, and win rate using official competitive rank emblems.

## Customer setup

1. Open the hosted setup page.
2. Create a free HenrikDev API key at https://api.henrikdev.xyz/dashboard/.
3. Enter the API key and Riot ID in `Name#TAG` format.
4. Select PC or Console and choose a palette.
5. Copy the generated browser-source URL into OBS, Meld, or Streamlabs.
6. Use browser-source dimensions `1952 × 1104`, then scale the source down in the scene.

The API key is stored only in the URL fragment after `#`, which is not sent to the host as part of the page request. The widget forwards it to the HenrikDev proxy when requesting player stats.

## Local development

```bash
npm install
npm run dev
```

The setup page is available at `/` and `/pastel`. The browser widget is available at `/widget` and `/pastel/widget`.

## Deployment

The app is configured for Vercel, including the `/api/player` proxy. Existing customers on the original deployment remain unaffected by this standalone project.
