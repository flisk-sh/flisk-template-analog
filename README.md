# create-analog

**Stack:** a real `create-analog` app (Angular)

**Notes:** scaffolder runs at build time; upgrades npm because the template's `$vite`/`$vitest` overrides fail on npm 10; Vite `--host 0.0.0.0`

Flisk bring-your-own template. The container contract is in [docs/byo.md](https://github.com/flisk-sh/flisk/blob/main/docs/byo.md).

## Check it

CI runs two checks on every pull request: `verify` builds the image, runs it with `PORT=4000` and expects HTTP 200 on `/`;
`e2e` registers it in a throwaway Flisk project, runs `flisk up`, and expects HTTP 200 through Traefik. To build it yourself:

```bash
docker build -t template . && docker run --rm -e PORT=4000 -p 4000:4000 template
```

## Register it in a Flisk project

```bash
flisk resource analog-app --type bring-your-own --stack shop --dockerfile ./Dockerfile --yes
```

Use a resource name that is unique across Flisk projects sharing one Docker daemon.
