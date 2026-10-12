export const variants = [
  {
    id: 'cli-only',
    title: 'Detalhes pelo CLI',
    description: 'O menu copia o ID da aba. Os detalhes ficam disponíveis pelo comando do Orca.',
    behavior:
      'Abre o menu, copia o ID e mostra a confirmação. A consulta pelo CLI não é executada nesta demonstração.',
    branch: 'feat/tab-details-cli-only',
    pullRequest: 'https://github.com/fabricedge/orca/pull/5',
    commits: [{ id: '8de43ed', label: 'Consulta de detalhes pelo CLI' }]
  },
  {
    id: 'split-control',
    title: 'Copy com hint Details',
    description: 'Uma linha de cópia, com a opção Details à direita para incluir posição e layout.',
    behavior:
      'Abre o menu, mostra o tooltip, copia o ID e depois os detalhes. Cada cópia tem sua própria confirmação.',
    branch: 'feat/tab-copy-split-control',
    pullRequest: 'https://github.com/fabricedge/orca/pull/6',
    commits: [
      { id: 'b2e05ba', label: 'Controle com hint Details' },
      { id: '98c76ee', label: 'Notificações de cópia' },
      { id: 'c5aaa8e', label: 'Tooltip sobre contexto para IA' }
    ]
  },
  {
    id: 'two-columns',
    title: 'Dois botões em colunas',
    description:
      'Copy Tab ID e Copy Tab Details ficam lado a lado, com instrução curta ao passar o mouse.',
    behavior: 'Demonstra as duas ações, o tooltip e as confirmações de cópia normal e detalhada.',
    branch: 'feat/tab-copy-two-columns',
    pullRequest: 'https://github.com/fabricedge/orca/pull/7',
    commits: [
      { id: 'd048b90', label: 'Menu com duas colunas' },
      { id: '60ba49f', label: 'Notificações de cópia' },
      { id: '80f79eb', label: 'Instrução curta para IA' }
    ]
  }
]
