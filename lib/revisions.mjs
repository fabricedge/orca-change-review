import { variants } from './tab-copy-variants.mjs'
import { validateRevisions } from './validate-revisions.mjs'
import { tabCopyReviewContent } from './tab-copy-review-content.mjs'
import { pageDates } from './review-site.mjs'
import additionalReviews from '../data/reviews.json' with { type: 'json' }

export const revisions = [
  ...additionalReviews,
  {
    slug: 'servico-linux',
    ...pageDates,
    title: 'Orca serve como serviço Linux',
    kind: 'PR',
    status: 'PR #4 publicado',
    recordedAt: '2026-10-11',
    summary:
      'Instalação segura de um serviço systemd de usuário, com pareamento mobile e execução após logout.',
    repository: 'fabricedge/orca',
    base: 'main',
    branches: ['feat/linux-serve-service-setup'],
    commits: [
      { id: 'b4799ad18bba66f94a5a6f04f2350c166d8d1c58', label: 'Serviço Linux para Orca serve' }
    ],
    pullRequest: 'https://github.com/fabricedge/orca/pull/4',
    implementation:
      'Script Bash implementado e testado. Integração ao CLI TypeScript proposta, ainda não implementada.',
    sections: [
      {
        id: 'mudanca',
        title: 'O que mudou',
        paragraphs: [
          'Antes, o usuário precisava manter Orca serve em um terminal ou configurar um serviço manualmente. O PR adiciona um instalador que configura um serviço systemd de usuário com pareamento mobile e lingering, para continuar executando sem uma sessão de login aberta.',
          'O serviço chama o launcher existente do Orca. O instalador verifica entradas e propriedade da unidade, preserva PATH e perfil, mantém uma instalação idêntica em execução e reinicia quando a configuração muda. Em caso de falha, tenta restaurar a unidade e o estado anteriores.',
          'Unidades sem a marca de propriedade exigem adoção explícita com backup. A remoção preserva perfil, pareamentos e lingering. As alterações de cópia de abas não fazem parte deste PR.'
        ]
      },
      {
        id: 'arquivos',
        title: 'Arquivos para revisar',
        files: [
          {
            path: 'config/scripts/setup-orca-serve.sh',
            description: 'Instalação, atualização e remoção do serviço.'
          },
          {
            path: 'config/scripts/setup-orca-serve.test.mjs',
            description: '46 casos de regressão com comandos externos simulados.'
          },
          {
            path: 'docs/site/content/docs/remote-servers.mdx',
            description: 'Configuração Linux e limites operacionais.'
          },
          {
            path: '.github/workflows/pr.yml',
            description: 'Validação Bash e ShellCheck no workflow existente.'
          }
        ]
      },
      {
        id: 'testes',
        title: 'Testes realizados',
        items: [
          '46 casos automatizados passaram, usando HOME temporário e comandos externos simulados, sem alterar os serviços do usuário.',
          'Sintaxe Bash e ShellCheck 0.9.0 passaram.',
          'Typecheck Node, verificação de qualidade das mudanças, Oxlint focado, formatação e git diff --check passaram.',
          'Um container Debian 12 com systemd 252 real validou instalação, habilitação, execução, argumentos com caracteres especiais, ambiente de perfil, reinstalação sem trocar PID, reinício após mudança de porta e remoção com lingering preservado.'
        ],
        paragraphs: [
          'O teste com systemd usou um launcher de teste. Ele identificou uma restrição no primeiro argumento de ExecStart; a unidade foi corrigida para executar o launcher via /usr/bin/env.'
        ],
        code: 'ORCA_BACKGROUND_LAUNCH=1 pnpm test config/scripts/setup-orca-serve.test.mjs'
      },
      {
        id: 'pendencias',
        title: 'O que ainda precisa de validação',
        items: [
          'Inicialização real do runtime Orca e pareamento/reconexão pelo celular.',
          'Reboot do host, login/logout SSH e launchers dos pacotes distribuídos.',
          'Lint completo, todos os typechecks, suíte completa e build: deixados para CI, sem resultado registrado nesta página.'
        ],
        paragraphs: [
          'Um serviço ativo não comprova que o servidor está pronto para pareamento. As evidências acima são do script Bash; elas não validam uma futura implementação TypeScript.'
        ]
      },
      {
        id: 'cli',
        title: 'Próxima melhoria: integrar ao CLI',
        paragraphs: [
          'A recomendação é distribuir a instalação dentro do CLI TypeScript do Orca. Isso torna os comandos acessíveis na instalação normal e permite reaproveitar a execução de processos, validação e testes do projeto.',
          'A leitura do código confirmou a viabilidade: o cliente de runtime é criado sob demanda e o dispatcher aceita caminhos completos de comandos. Um handler local pode instalar o serviço sem um servidor em execução. A versão CLI ainda não foi escrita.'
        ],
        code: 'orca serve install --pairing-address <endereço>\norca serve status\norca serve uninstall',
        codeCaption: 'Interface proposta. Estes comandos ainda não estão disponíveis.',
        items: [
          'Preservar o comportamento atual de orca serve em primeiro plano.',
          'Manter a implementação systemd restrita ao Linux, com mensagem clara nas outras plataformas.',
          'Reutilizar os wrappers de processos e avaliar o código existente de systemd e lingering, respeitando as dependências do CLI.',
          'Preservar ownership, backups, rollback, bloqueio de concorrência e escaping; resolver um launcher estável nas instalações empacotadas.',
          'Manter a restrição da ponte SSH do Orca para comandos serve. Um login SSH comum executa no host e é um caso diferente.',
          'Testar parsing, help, execução sem runtime, launchers e rollback, migrar os casos existentes e repetir o teste com systemd real.'
        ]
      }
    ]
  },
  ...variants.map((variant) => ({
    slug: variant.id,
    createdAt: '2026-10-11T23:09:04Z',
    updatedAt: '2026-10-11T23:28:26Z',
    title: variant.title,
    kind: 'Commit',
    status: 'Commits locais; PR ainda não publicado',
    summary: variant.description,
    branches: [variant.branch],
    commits: variant.commits,
    implementation:
      'Alternativa independente. Os commits estão no bundle local; não há link público de commit confirmado.',
    comparison: true,
    variantIds: [variant.id],
    sections: tabCopyReviewContent[variant.id]
  })),
  {
    slug: 'copia-de-abas',
    ...pageDates,
    title: 'Três formas de copiar uma aba',
    kind: 'Comparação',
    status: '3 alternativas de interface',
    summary:
      'Compare os menus, as instruções para IA e as notificações usando gravações dos componentes reais.',
    branches: variants.map((variant) => variant.branch),
    commits: variants.flatMap((variant) => variant.commits),
    implementation:
      'As três branches são alternativas entre si. As gravações usam dados de demonstração.',
    comparison: true,
    sections: []
  }
]

validateRevisions(revisions)

export function findRevision(slug) {
  return revisions.find((revision) => revision.slug === slug)
}

export function revisionHref(revision) {
  return `/revisoes/${revision.slug}`
}

export function formatRecordedDate(date) {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}
