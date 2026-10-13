# donotteachme web

The `web` folder contains the public-facing Next.js application for `donotteachme.com`.

## Stack

- Next.js 16
- App Router
- TypeScript
- Tailwind CSS
- Sanity Content Lake
- Cloudflare Workers via `@opennextjs/cloudflare`

`next` and `eslint-config-next` are temporarily pinned to **16.3.8**. Next.js 16.4 adds a `preview-props.json` manifest that the current OpenNext adapter omits, causing Cloudflare Error 1101 despite successful builds and deployments. Track the [upstream fix](https://github.com/opennextjs/opennextjs-cloudflare/pull/1356). Upgrade these packages together only after checking adapter compatibility and testing requests in the Cloudflare Workers runtime.

## Local development

Use Node.js 24, as specified in `.nvmrc`. If you use nvm, run `nvm install` and `nvm use` from this folder.

Install the exact dependencies recorded in the lockfile:

```bash
npm ci
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

## Automatic deployment from GitHub

This repository is connected to Cloudflare Workers Builds. Pushing a new commit to `main` starts a build; a successful deployment updates `https://donotteachme.com`. If the build fails, GitHub still receives your commit, but the website keeps its previous deployment.

The local `web` folder is itself the Git repository root. The corresponding Cloudflare build settings are:

| Setting | Value |
| --- | --- |
| Repository | `scary-two/donotteachme` |
| Production branch | `main` |
| Root directory | `./` |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npx opennextjs-cloudflare deploy` |
| Node.js | `24`, selected by the repository's `.nvmrc` |

These are the settings to check in Cloudflare; editing this README does not change dashboard settings. The root directory is `./` because GitHub already has `package.json` at its root.

Before uploading changes, validate them from the local website folder:

```bash
cd "/home/kevin11/Documents/Blogging Website_04/web"
npm ci
npm run lint
npm run build:cloudflare
```

Test the built Worker before pushing:

```bash
npx opennextjs-cloudflare preview
```

Open the local URL printed in the terminal and check `/`, `/search?q=test`, and a real `/post/<slug>` linked from the homepage. Confirm that content loads and the preview terminal shows no exceptions, then stop it with Ctrl+C. A successful build alone does not verify that the deployed Worker can serve requests.

Then review and commit the intended files, including new components:

```bash
git status
git diff
git add .
git diff --cached --stat
git commit -m "Update website"
git push origin main
```

After pushing, open the commit on GitHub and check its **Cloudflare Workers Builds** result, or open **Cloudflare → Workers & Pages → donotteachme → Builds**. Wait for deployment to succeed, then repeat the page checks on the live website. If the build fails, check its build log; if deployment succeeds but a page errors, check the Worker's runtime logs. Pushing an unchanged branch will not create a new commit or fix the error.

When changing dependencies, use `npm install <package>@<version>` and commit both `package.json` and the resulting `package-lock.json` together. Avoid replacing either file with an unrelated copy or bypassing dependency conflicts with `--force` or `--legacy-peer-deps`. `npm ci` verifies that a clean install can use the committed dependency versions; lint and the Cloudflare build validate the application.

Cloudflare supports `.nvmrc` for selecting the build's Node.js version. See its [build image documentation](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/).

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
