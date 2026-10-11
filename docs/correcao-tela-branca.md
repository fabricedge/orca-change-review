# Correção da tela branca em /en/tab-copy

Registro: 11/10/2026.

## Causa e mudança

O servidor respondia HTTP 500 com a mensagem de que `app/revisoes/[slug]/page.jsx` não tinha um layout raiz. A reorganização por idioma manteve o layout de `[locale]`, mas deixou as revisões fora de uma raiz válida. Esse erro de compilação também impedia a página inglesa de abrir.

A correção adicionou um layout raiz próprio para `/revisoes`, restaurou o catálogo nesse endereço e ajustou os links de retorno. A página de revisão inexistente passou para essa mesma seção. As páginas existentes em inglês e português e o redirecionamento de `/` foram preservados.

Os estilos ausentes das revisões foram recuperados em `app/revisoes/reviews.css`, importado somente pelo layout dessa seção. A navegação das páginas de idiomas ganhou um link para o catálogo. As origens de desenvolvimento permitem explicitamente loopback, hostname e os endereços Tailscale desta máquina.

## Evidência

- PASS: o endereço exato `http://100.91.176.16:3100/en/tab-copy` voltou de HTTP 500 para HTTP 200.
- PASS: Chromium headless renderizou `/en/tab-copy`, `/pt-BR/tab-copy`, `/revisoes`, `/revisoes/servico-linux` e `/revisoes/copia-de-abas` a 390px e 1440px, sem overflow horizontal.
- PASS: troca de idioma alterou o conteúdo e o atributo `lang` corretamente; link do catálogo, busca, leitura do PR e retorno à página inglesa funcionaram.
- PASS: nenhum erro de execução ou console no navegador durante o teste final.
- PASS: build de produção com Turbopack, usando saída separada do servidor em execução.
- PASS: Oxlint focado nos módulos corrigidos; Oxfmt nos arquivos preparados.

## Gate da interface corrigida

- PASS, hard gate: páginas visíveis no endereço informado, links funcionais, layout mobile sem transbordamento e conteúdo existente preservado, comprovados no navegador.
- PASS, propósito: layout raiz definido por seção para coexistir com os idiomas; estilos de revisão restaurados sem reescrever os estilos das páginas traduzidas.
- PASS, leitura: hierarquia existente de título, metadados de branch, testes e vídeos preservada; nenhum asset, animação ou conteúdo demonstrativo novo.
- PASS, qualidade: build confirma as duas estruturas de layout; navegação entre elas e controles interativos confirmados pelo Tailscale.

Capturas e resultado JSON: `/tmp/orca-route-regression/`. Backup anterior à correção: `/tmp/orca-route-fix-backup/`.
