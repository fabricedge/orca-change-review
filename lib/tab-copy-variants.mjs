export const variants = [
  {
    id: 'cli-only',
    title: 'Detalhes pelo CLI',
    description: 'O menu copia o ID da aba. Os detalhes ficam disponíveis pelo comando do Orca.',
    behavior:
      'Abre o menu, copia o ID e mostra a confirmação. A consulta pelo CLI não é executada nesta demonstração.',
    branch: 'feat/tab-details-cli-only',
    pullRequest: 'https://github.com/fabricedge/orca/pull/5',
    commits: [{ id: '2391609d67bd', label: 'JSON e CLI de leitura, sobre o PR #1' }]
  },
  {
    id: 'split-control',
    title: 'Copy com hint Details',
    description: 'Uma linha de cópia, com a opção Details à direita para incluir posição e layout.',
    behavior:
      'Abre o menu, mostra o tooltip, copia o ID e depois os detalhes. Cada cópia tem sua própria confirmação.',
    branch: 'feat/tab-copy-split-control',
    pullRequest: 'https://github.com/fabricedge/orca/pull/6',
    commits: [{ id: '719a735c9b25', label: 'JSON, CLI e Details na mesma linha, sobre o PR #1' }]
  },
  {
    id: 'two-columns',
    title: 'Dois botões em colunas',
    description:
      'Copy Tab ID e Copy Tab Details ficam lado a lado, com instrução curta ao passar o mouse.',
    behavior: 'Demonstra as duas ações, o tooltip e as confirmações de cópia normal e detalhada.',
    branch: 'feat/tab-copy-two-columns',
    pullRequest: 'https://github.com/fabricedge/orca/pull/7',
    commits: [{ id: 'db33ac6e03b9', label: 'JSON, CLI e cópia lado a lado, sobre o PR #1' }]
  }
]
