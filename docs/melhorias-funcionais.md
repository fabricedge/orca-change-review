# Revisão funcional — 11/10/2026

## Fonte e atualização

A fonte editável é `orca/artifacts/orca-changes-stuff`. A pasta `~/projects/orca-changes-stuff` é a instalação. Altere a fonte e publique pelo instalador; mudanças feitas apenas na instalação serão substituídas.

```bash
node artifacts/install-orca-changes-stuff.mjs ../orca-changes-stuff --update-site --check-only
node artifacts/install-orca-changes-stuff.mjs ../orca-changes-stuff --update-site
```

O instalador monta uma pasta temporária, valida os registros e compila o Next antes de modificar a instalação. Substitui app/lib completos para remover rotas antigas, guarda backup em `.orca-site-backups` e restaura os arquivos anteriores se a cópia falhar. A troca de vários diretórios não é atômica: publique em uma janela sem edição concorrente. Não altera mídia, dependências nem `.env.local`.

## Navegação e avaliação

- `/` abre o catálogo `/revisoes`, em português com idioma HTML correto, navegação, estilos e link para a demonstração em inglês.
- As demonstrações anteriores em `/en/tab-copy` e `/pt-BR/tab-copy` continuam disponíveis. O catálogo ainda não tem tradução completa para inglês.
- Busca e tipo ficam na URL (`q`, `tipo`), permitindo compartilhar e retornar pelo botão Voltar do navegador.
- A revisão de cópia de abas permite escolher duas alternativas, comparar descrição, evidência e commits, assistir aos vídeos e abrir as capturas completas.
- Cada revisão permite salvar resultado e justificativa no navegador. A chave inclui os commits: uma versão diferente não herda aprovação. A exportação JSON contém commits e data. Não existe sincronização de decisões entre dispositivos nem envio ao GitHub.
- O PR #4 continua identificado como script Bash testado; a implementação CLI permanece proposta. Os testes de fixture não equivalem a inicialização real, pareamento ou reboot.

## Cadastro futuro

Adicione a revisão em `lib/revisions.mjs`, com slug único, título, resumo, tipo, estado, implementação, branches, commits e seções. Rode `node scripts/check-revisions.mjs`. O instalador impede publicação quando faltar esse contrato ou o build falhar. O estado do PR é um registro datado; consulte o link do GitHub para o estado atual.

## Direção visual

Preservados Geist, cores neutras e azul nos links. ENERGY 2 / RHYTHM 2 / MOTION 0: leitura de branches e evidências, sem movimento decorativo. O foco é título, comparação ou decisão conforme a etapa. Os dois lados empilham em telas menores, controles têm rótulos e altura mínima de 48px.

## Validação

Build de produção isolado passou antes da publicação. Oxlint dos novos componentes, validação de conteúdo e atualizador passou. Testes de segurança cobrem catálogo válido, commits ausentes/inválidos, slugs duplicados e rejeição de atualização incompleta ou com catálogo inválido sem alterar a instalação.

Chromium headless pelo Tailscale: cinco rotas (`/en/tab-copy`, `/pt-BR/tab-copy`, catálogo e duas revisões) renderizaram em 390 e 1440px sem erros de execução. Troca de idioma, filtro por URL, retorno pelo navegador, comparação A/B sem escolhas duplicadas, decisões após reload e exportação JSON passaram. Uma aprovação gravada para outro commit não foi reaplicada. Comparação sem overflow em 320/390/768/1440px, temas claro/escuro e texto a 200%. Capturas de catálogo e comparação inspecionadas.

Antislop: conteúdo orientado à revisão, sem estatísticas inventadas ou elementos decorativos; hierarquia preservada; foco e controles nativos; layout responsivo validado. Não foram executados teste com leitor de tela nem auditoria completa de acessibilidade.
