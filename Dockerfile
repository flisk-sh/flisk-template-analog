# A real create-analog app: the scaffolder runs at build time.
FROM node:22-alpine@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402
# create-analog runs `git init` even with --skipGit.
RUN apk add --no-cache git
WORKDIR /work
RUN npm create analog@latest app -- --template latest --skipTailwind --analogSFC=false --skipGit </dev/null
WORKDIR /work/app
# The template pins vite/vitest with "$ref" overrides that npm 10 cannot resolve, so use a published npm 11.
RUN npm install -g npm@11.21.1
# The scaffold writes no lockfile, so `npm ci` cannot run.
RUN npm install
# Build here and serve the production server: the Vite dev server ran out of heap (~250 MB) bundling dependencies
# on the first request inside the memory limit `flisk up` gives a container, so Traefik never saw it healthy.
RUN npm run build
ENV NODE_ENV=production HOST=0.0.0.0
RUN chown -R node:node .
USER node
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 CMD nc -z 127.0.0.1 ${PORT:-3000} || exit 1
# The Nitro server (dist/analog/server/index.mjs) reads PORT and HOST.
CMD ["npm", "run", "preview"]
