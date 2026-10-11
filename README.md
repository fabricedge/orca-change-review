# Orca Review Changes

## Automated test evidence and MCP

Orca Review Changes creates pages where developers share automated videos of Orca tests and features, alongside descriptions, results and limitations. **These pages do not replace proper review of the PR on GitHub, its code, tests or CI results.** A video alone does not prove that a test passed.

The website's **Tests & MCP** page explains the workflow in English and Portuguese. The [recording guide](docs/test-recording.md) and [MCP guide](docs/mcp.md) show how to connect an agent, run an existing Orca Electron E2E spec with video capture, inspect the report and save an evidence page linked to a PR or commit. MCP runs on the developer's host; Pages hosts the resulting static pages and Releases stores reviewed videos.

Issue preparation supports reports of problems found in tests. A local draft does not require a PR or commit. Identify the actual user problem, follow the target repository's current issue guidelines, and keep unrelated work out of an oversized PR.

## Create your own Orca Review

Publish your own Orca changes, PR descriptions and recordings using this site:

1. Fork this repository into your GitHub account and clone your fork. Keep it public for the free GitHub Pages workflow.
2. Install Node.js 24 or later, then run `npm ci`.
3. Replace the examples in `lib/revisions.mjs` with your reviews, or use MCP to add records to `data/reviews.json`. Each entry needs an issue, problem-first issue draft, PR URL or commit, its description, and `createdAt` / `updatedAt` timestamps in ISO 8601 format with a timezone. Run `npm run check:changes`.
4. Set `NEXT_PUBLIC_SITE_REPOSITORY=your-username/your-repository` in `.env.local` for local previews. The topbar derives your GitHub username and repository links from this value. The Pages workflow sets it automatically from your fork's repository.
5. Set the page timestamps in `lib/review-site.mjs`. Preserve `createdAt` when editing; change `updatedAt` only when the page content changes. Dates describe review pages, not the age of a PR, recording or deployment. For existing pages, creation uses their first site publication; new individual reviews start when introduced. Timestamps display in UTC and do not change merely because someone reloads or rebuilds the site.
6. Remove the example `media/releases.json` before importing your own recordings. Configure `ORCA_SOURCE` in `.env.local` if you record from an Orca checkout. Publish your videos to your own GitHub Releases using the [release guide](docs/github-releases.md); keep video files out of Git.
7. In **Settings → Pages → Build and deployment**, select **GitHub Actions**. Push to `main` or manually run the **Pages** workflow. See the [Pages guide](docs/github-pages.md) for the workflow and troubleshooting.

Preview with `npm run dev`. Check the static export with `ORCA_GITHUB_PAGES=1 NEXT_PUBLIC_BASE_PATH=/your-repository npm run build -- --webpack` on Linux/macOS; on Windows, set these environment variables in your shell before running the build. A GitHub Pages site is public: publish only review content and media you intend to share.

The **Create your own Orca Review** link in the topbar points to this section in the configured repository. All topbar identity and invitation text is available in English and Portuguese.

Para publicar o site estático no GitHub Pages: [guia de deploy](docs/github-pages.md). O comando único no checkout Orca é `bash artifacts/deploy-orca-pages.sh`.

## GitHub Releases e próximas mudanças

Use `bash scripts/publish-github.sh` para criar o repositório público `orca-change-review`, publicar o código e enviar vídeos para um Release. O manifesto versionado aponta para os assets externos; vídeos não entram no Git. [Guia de publicação](docs/github-releases.md).

Cada mudança tem sua própria página e precisa de um PR ou commit. As três alternativas de cópia também aparecem separadas no catálogo, além da comparação conjunta. [Como adicionar mudanças](docs/adding-changes.md). Rode `npm run check:changes` antes de publicar.

Servidor Next.js para revisar mudanças do Orca pelo navegador. A página inicial é o catálogo de PRs e comparações, com busca compartilhável, evidências, comparação A/B e decisões locais por commit. Sem autenticação própria: use na sua rede Tailscale.

## Idiomas e URLs

A raiz `/` abre `/revisoes`, em português. As demonstrações anteriores continuam em `/en/tab-copy` e `/pt-BR/tab-copy`, com seletor de idioma. O catálogo ainda não tem tradução completa. Branches, commits e conteúdo gravado não são traduzidos.

Para atualizar o site que já foi instalado:

```sh
node /home/katrina/projects/orca/artifacts/install-orca-changes-stuff.mjs --update-site
```

Edite somente a fonte em `orca/artifacts/orca-changes-stuff`; a pasta irmã é a instalação. O comando valida os registros e o build em uma pasta temporária antes de publicar, guarda backup em `.orca-site-backups` e preserva `.env.local`, mídias e dependências. Acrescente `--check-only` para validar sem publicar. Reinicie `npm run dev` e abra `/revisoes`. Veja [melhorias e limites](docs/melhorias-funcionais.md).

## Instalar no local pedido

O sandbox não permite escrever em `../orca-changes-stuff`. O projeto foi preparado dentro de `orca/artifacts/`. Execute fora do sandbox:

```sh
node /home/katrina/projects/orca/artifacts/install-orca-changes-stuff.mjs
cd /home/katrina/projects/orca-changes-stuff
npm install
npm run dev
```

O instalador recusa sobrescrever uma pasta que já contenha arquivos. Precisa de Node 24 e acesso ao registro npm para instalar Next.js.

O servidor usa `0.0.0.0:3100`. No celular conectado à mesma rede Tailscale, abra `http://IP-TAILSCALE-DO-PC:3100`. O IP pode ser consultado no PC com `tailscale ip -4`.

Alternativa HTTPS:

```sh
tailscale serve --bg --https=8444 http://127.0.0.1:3100
```

Abra o endereço informado. O servidor precisa continuar rodando no PC. Para uma execução de produção: `npm run build` seguido de `npm start`.

## Rodar as três versões e gravar o Orca completo

O importador publica vídeos apenas quando `capture.json` confirma `kind: orca-app`. Os vídeos antigos de componentes isolados ficam ocultos. Se a página disser que não há gravação completa, `import:orca` sozinho não resolve: primeiro execute o gravador. O roteiro mostra o workspace, abre README.md e CLAUDE.md, troca de aba e demonstra o menu de cópia. O importador adiciona uma versão às URLs de mídia para o navegador não reutilizar o vídeo antigo em cache.

Na pasta `orca-changes-stuff`, execute:

```sh
npm run record:orca
npm run import:orca
npm run dev
```

O primeiro comando cria três clones temporários, busca os commits no bundle local, instala dependências com pnpm e compila cada versão. Depois inicia o aplicativo Electron completo, uma versão por vez, com perfis e projetos descartáveis. Usa o fixture Playwright dos testes do Orca para abrir um projeto e `README.md`, abrir o menu da aba, copiar o ID e, nas duas variantes com detalhes, mostrar o tooltip e copiar o JSON. Confere a área de transferência real do Electron e as notificações. Não exige configurar URLs nem iniciar os apps manualmente.

As janelas ficam ocultas com `ORCA_BACKGROUND_LAUNCH=1` e `ORCA_E2E_HEADLESS=1`; a captura usa o renderer via Playwright/CDP. Cada aplicativo encerra após sua gravação. Não altera seu checkout, perfil ou branches. As versões são alternativas. Os vídeos mostram o aplicativo completo com dados de demonstração. A variante CLI-only demonstra a ausência de detalhes no menu; não executa o comando CLI no vídeo.

Requisitos: Node 24, Git, pnpm, dependências de sistema do Electron e acesso ao registro para instalar dependências. A primeira execução compila três apps e pode demorar e ocupar vários GB. Em Linux precisa de sessão gráfica; sem `DISPLAY`, execute a partir do checkout Orca:

```sh
xvfb-run -a node artifacts/tab-copy-prs/recording/run-three.mjs
```

Não precisa de Chromium separado: usa o Electron instalado em cada clone. No macOS/Windows execute o comando npm normalmente. Os vídeos usam a área de transferência do sistema durante a demonstração.

Os resultados ficam em `ORCA_SOURCE/artifacts/tab-copy-prs/images/videos`: três `.webm`, screenshots, `capture.json` e `index.html`. Os vídeos antigos só são substituídos quando as três gravações passam. Em caso de erro, o log informa o diretório temporário com clones, resultados e gravações parciais; os vídeos anteriores continuam disponíveis. Os clones são preservados e podem ser apagados depois.

Para conferir bundle e base Git sem abrir apps:

```sh
npm run record:orca -- --check
```

O gravador e seu teste estão no checkout Orca em `artifacts/tab-copy-prs/recording/`. Se o projeto Next já existia antes deste comando npm, atualize somente o gravador e sua documentação:

```sh
node /home/katrina/projects/orca/artifacts/install-orca-changes-stuff.mjs --update-recording
```

Essa opção adiciona `record:orca` ao `package.json`, atualiza o script e salva este guia como `RECORDING.md` no projeto existente. Preserva o README e as outras entradas do package.json. A instalação normal continua recusando sobrescrever pastas existentes.

## Atualizar mídias

`npm run dev` e `npm run build` importam automaticamente os vídeos e imagens do checkout irmão `../orca`. Para atualizar com o servidor rodando:

```sh
npm run import:orca
```

Depois atualize a página. Para outro checkout, defina `ORCA_SOURCE` no ambiente ou em `.env.local`. O instalador já grava o caminho deste checkout nesse arquivo.

A importação copia apenas arquivos conhecidos de `artifacts/tab-copy-prs/images/videos`, o bundle dos commits e a fonte Geist. Não serve a pasta do repositório nem arquivos arbitrários. Não modifica o Orca ou seus branches.

Para adicionar revisões ao catálogo, edite `lib/revisions.mjs` na fonte e rode `node scripts/check-revisions.mjs`. Novas variantes de mídia também exigem ampliar `lib/tab-copy-variants.mjs` e o importador. As mídias ficam em `public/media`; nenhum serviço externo recebe os arquivos.

## Validação

Build isolado, lint focado, testes de segurança de atualização e fluxos reais no navegador passaram. Consulte docs/melhorias-funcionais.md para escopo, resultados e limitações.
