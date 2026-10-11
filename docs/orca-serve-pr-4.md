# PR #4: serviço Linux para Orca serve

Registro de 11 de outubro de 2026. Este documento descreve o trabalho realizado; não consulta o estado atual do GitHub automaticamente.

## Branch e revisão

- PR: https://github.com/fabricedge/orca/pull/4
- Repositório: `fabricedge/orca`
- Base: `main`
- Branch: `feat/linux-serve-service-setup`
- Commit: `b4799ad18bba66f94a5a6f04f2350c166d8d1c58`
- Implementação publicada: script Bash. A versão integrada ao CLI ainda é uma proposta.

## Antes e depois

Antes, o usuário precisava manter `orca serve` em um terminal ou configurar um serviço manualmente. O script instala um serviço systemd de usuário, habilita lingering e configura o pareamento mobile para permitir execução sem uma sessão de login aberta.

O serviço usa o launcher existente do Orca. A instalação verifica entradas e propriedade do arquivo, preserva PATH e configurações de perfil, mantém um serviço idêntico em execução e reinicia quando a configuração muda. Falhas de aplicação tentam restaurar a unidade e o estado anteriores. Unidades sem a marca de propriedade exigem adoção explícita com backup. A remoção preserva perfil, pareamentos e lingering.

## Arquivos do PR

1. `config/scripts/setup-orca-serve.sh`: instalação e remoção do serviço Linux.
2. `config/scripts/setup-orca-serve.test.mjs`: 46 casos de regressão isolados.
3. `docs/site/content/docs/remote-servers.mdx`: instruções de configuração e limites.
4. `.github/workflows/pr.yml`: validação Bash e ShellCheck.

As alterações de cópia de abas do checkout original não foram incluídas neste PR. A branch foi criada sem trocar a branch de trabalho do usuário.

## O que foi testado

- 46 casos automatizados passaram, com HOME temporário e comandos externos simulados.
- Sintaxe Bash e ShellCheck 0.9.0 passaram.
- `pnpm tc:node`, verificação de qualidade das mudanças, Oxlint focado, formatação e `git diff --check` passaram.
- Um container Debian 12 com systemd 252 real validou instalação, habilitação, execução, argumentos com caracteres especiais, ambiente de perfil, reinstalação sem trocar PID, reinício após mudança de porta e remoção com lingering preservado.

O teste de systemd usou um launcher de teste, não o runtime Orca. Ele encontrou uma restrição no primeiro argumento de ExecStart; a unidade foi corrigida para iniciar o launcher via `/usr/bin/env`.

## Limites da evidência

Não foram testados nesta mudança: inicialização real do Orca, pareamento/reconexão pelo celular, reboot do host, login/logout SSH ou launchers de todos os pacotes. Lint completo, todos os typechecks, suíte completa e build ficaram para CI. Serviço ativo não equivale a servidor pronto para pareamento.

## Proposta: integrar ao CLI TypeScript

Interface sugerida, ainda não disponível:

```text
orca serve install --pairing-address <endereço>
orca serve status
orca serve uninstall
```

`orca serve` continuaria iniciando o servidor em primeiro plano. A melhoria principal é distribuir a configuração com o próprio Orca e reaproveitar validação, execução de processos e testes TypeScript. Trocar apenas a extensão do script por JavaScript não resolve a descoberta e distribuição do comando.

### Viabilidade verificada no código

- `src/cli/index.ts` cria o cliente de runtime apenas quando o handler acessa `client`; um instalador local pode funcionar sem servidor em execução.
- `src/cli/dispatch.ts` usa caminhos completos de comandos e permite registrar `serve install`, `serve status` e `serve uninstall`.
- `src/cli/specs/serve.ts` contém a especificação atual de `serve`; novos comandos precisam de especificações e registro de handlers próprios.
- A seleção remota já é ignorada para comandos `serve`.
- `src/cli/ssh-bridge-command-policy.ts` bloqueia comandos `serve` na ponte SSH restrita do Orca. Essa proteção deve permanecer. Um login SSH comum executando o CLI instalado no host é um caso diferente.
- Há código existente de systemd e lingering em `src/main/daemon/`; o reaproveitamento deve respeitar os limites de dependências entre CLI e main.

### Próximos passos para substituir o script

1. Implementar os comandos locais em TypeScript, usando os wrappers de processos existentes e verificações de plataforma em runtime.
2. Preservar ownership, backup, rollback, bloqueio de instalações concorrentes, escaping systemd e reinstalação idempotente.
3. Resolver um launcher estável para instalações empacotadas; não assumir que `process.execPath` sozinho representa o comando CLI.
4. Testar parsing/help, execução sem runtime, rejeição em plataformas sem suporte e política da ponte SSH.
5. Migrar os casos de regressão e repetir a validação com systemd real, incluindo caminhos e perfis com caracteres especiais.
6. Atualizar documentação e CI do mesmo PR para refletir a implementação final.

Conclusão técnica: a arquitetura do CLI permite essa abordagem. A implementação CLI ainda precisa ser escrita e validada; os resultados dos testes Bash não provam a futura versão TypeScript.
