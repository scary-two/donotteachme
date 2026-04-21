# donotteachme web

The `web` folder contains the public-facing Next.js application for `donotteachme.com`.

## Stack

- Next.js 16
- App Router
- TypeScript
- Tailwind CSS
- Sanity Content Lake
- Cloudflare Workers via `@opennextjs/cloudflare`

## Local development

Install dependencies:

```bash
npm install
```

Run the normal Next.js development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Sanity environment variables

For local Cloudflare-style preview, copy `.dev.vars.example` to `.dev.vars` and set:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=wooaj8n0
NEXT_PUBLIC_SANITY_DATASET=production
```

The app also has code-level fallbacks for these values, but keeping them in Cloudflare variables is the recommended setup.

## Cloudflare scripts

Build the standard Next.js app:

```bash
npm run build
```

Build the Cloudflare/OpenNext worker output:

```bash
npm run build:cloudflare
```

Preview the app in the Cloudflare Workers runtime:

```bash
npm run preview
```

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

Generate Cloudflare environment typings:

```bash
npm run cf-typegen
```

## Files added for Cloudflare

- `wrangler.jsonc`: Cloudflare Worker configuration
- `open-next.config.ts`: OpenNext Cloudflare adapter configuration
- `.dev.vars.example`: example local Cloudflare runtime variables

## Deployment plan for donotteachme.com

Recommended setup:

- `donotteachme.com` -> Cloudflare Worker for the website
- `www.donotteachme.com` -> redirect to `donotteachme.com`
- `studio.donotteachme.com` -> optional later, if you decide to self-host Sanity Studio
- initial Studio URL -> `*.sanity.studio` via `npx sanity deploy`

### First deployment

1. Log into Cloudflare:

```bash
npx wrangler login
```

2. In the Cloudflare dashboard, create or connect the Workers project when prompted by deploy.

3. Add environment variables in Cloudflare for the Worker:

- `NEXT_PUBLIC_SANITY_PROJECT_ID=wooaj8n0`
- `NEXT_PUBLIC_SANITY_DATASET=production`

4. Deploy from the `web` folder:

```bash
npm run deploy
```

5. After the Worker is live, attach the custom domain `donotteachme.com` in Cloudflare.

### Custom domain

After the first deployment:

1. Open Cloudflare Dashboard
2. Go to `Workers & Pages`
3. Open the `donotteachme` Worker
4. Open `Settings` or `Domains & Routes`
5. Add custom domains:
   - `donotteachme.com`
   - optionally `www.donotteachme.com`
6. Add a redirect rule so `www.donotteachme.com` redirects to `https://donotteachme.com`

## Sanity Studio deployment

The `studio` folder can be deployed independently using:

```bash
cd ../studio
npx sanity deploy
```

This is the quickest way to get an online Studio.
