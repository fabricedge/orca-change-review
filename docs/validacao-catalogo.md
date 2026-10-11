# Validação do catálogo de revisões

Registro: 11/10/2026. Projeto: `/home/katrina/projects/orca-changes-stuff`.

## Execução

- PASS: `npm run build`, com Turbopack e saída temporária separada do servidor em execução.
- PASS: Oxlint dos módulos de `app`, `lib` e configuração Next.js, sem erros.
- PASS: Oxfmt dos arquivos do app, cadastro, README e configuração, sem diferenças.
- PASS: 10 verificações Playwright em Chromium headless, contra o app em `http://127.0.0.1:3100`, sem erros de página.

## Gate antislop

- PASS, hard gate: conteúdo baseado no PR e nos commits registrados; proposta CLI identificada como não implementada; navegação e busca exercitadas; sem overflow a 320, 390, 768, 1024 e 1440px nos temas claro e escuro. Sem em dash, estatísticas inventadas, testemunhos ou assets novos.
- PASS, propósito: catálogo em linhas para localizar assunto e branch; página textual para examinar código, testes e limitações; comparação com vídeos preservada. Geist mantém a identidade existente. Acento azul limitado aos links de leitura, sem gradientes, glow, sombras decorativas ou ícones genéricos.
- PASS, leitura: energia 1, ritmo 2, movimento 1. Hierarquia entre título, resumo e metadados; separadores e referências de branch repetidos para orientar a leitura; índice compacto e conteúdo longo com espaço de leitura; nenhum movimento automático acrescentado.
- PASS, qualidade: busca por acento, branch, commit e PR; filtro por tipo; estado vazio e limpeza; ida e volta entre páginas; vídeos, capturas e links de download preservados; skip link e foco por teclado; texto ampliado em 200%; revisão inexistente com retorno à lista. Estados de carregamento e erro incluem texto e ação de recuperação.

## Contraste

- PASS: texto secundário `#666666` sobre `#f5f5f5`, 5,27:1.
- PASS: link `#1d4ed8` sobre branco, 6,70:1.
- PASS: texto secundário `#a1a1a1` sobre `#262626`, 5,86:1.
- PASS: link `#93c5fd` sobre `#0a0a0a`, 10,98:1.

As cores de texto principal e foco têm contraste maior que os pares secundários acima. Os contornos dos campos usam as cores secundárias em fundos neutros, acima de 3:1.

## Observações

O Next.js estava bloqueando os recursos de desenvolvimento ao acessar por loopback alternativo. A configuração agora permite `127.0.0.1`, o hostname local e os endereços Tailscale explícitos de `.env.local`. Os comandos padrão de desenvolvimento e build foram preservados.

O framework pode enviar HTTP 200 para uma página não encontrada após iniciar streaming. O teste confirma a mensagem, o metadado `noindex` e o retorno à lista, seguindo o comportamento documentado nesta versão do Next.js.

Os testes do serviço Linux descritos na revisão são evidências do PR anterior, não novas execuções deste app. O app não sincroniza informações com o GitHub.

Resultados JSON e capturas desta execução: `/tmp/orca-review-browser/`. Backup dos arquivos anteriores: `/tmp/orca-review-backup-20261011/`.
