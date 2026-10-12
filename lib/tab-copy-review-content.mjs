export const tabCopyReviewContent = {
  'cli-only': [
    {
      id: 'objetivo',
      title: 'O que esta alternativa resolve',
      paragraphs: [
        'O usuário precisa compartilhar uma aba específica com um agente sem confundi-la com a aba que está em foco. O ID identifica a aba; os detalhes de layout explicam em qual workspace e grupo ela está e sua posição nesse grupo.',
        'Esta alternativa parte do PR #1 e mantém apenas Copy Tab ID nos menus de navegador, arquivo e terminal. O commit inclui o JSON e o comando de leitura layout show. Não depende dos PRs #2, #3 ou #4 e não acrescenta comandos para mover abas ou alterar barras laterais.'
      ]
    },
    {
      id: 'uso',
      title: 'Como usar: do menu ao agente',
      items: [
        'Abra o menu da aba desejada e escolha Copy Tab ID. O clipboard recebe orcaTabId: seguido do ID da aba clicada.',
        'Passe esse identificador ao agente. O comando layout show aceita tanto o ID puro quanto o texto copiado completo entre aspas.',
        'Execute a consulta abaixo no workspace correto. Ela lê o estado do layout; não move a aba nem inicia um terminal.',
        'Em uma conexão remota, informe --worktree explicitamente. Não dependa do diretório local do cliente para selecionar um workspace no host remoto.'
      ],
      code: 'orca layout show --tab "orcaTabId: <tab-id>" --json\n\n# Workspace explícito, obrigatório no cliente remoto:\norca layout show --worktree "id:<workspace-id>" --tab "<tab-id>" --json',
      codeCaption:
        'Substitua os valores entre < > pelos IDs reais. Reutiliza a conexão de runtime já configurada no CLI.'
    },
    {
      id: 'dados',
      title: 'O que os detalhes significam',
      items: [
        'workspaceId identifica o workspace; tabId identifica a aba e contentId identifica seu conteúdo.',
        'type e title descrevem o conteúdo; groupId indica o grupo que contém a aba.',
        'position começa em zero dentro do grupo. Não é uma coordenada em pixels nem um índice global de todas as abas.',
        'bounds descreve a área do grupo em coordenadas normalizadas do workspace. Pode ser null quando não há geometria disponível.',
        'availability distingue um layout aberto de registros de sessão salvos. isDisplayed informa se a aba está exibida no workspace ativo.',
        'revision permite reconhecer mudanças no layout entre a consulta e uma operação posterior. Não trate um JSON antigo como a posição atual garantida.'
      ]
    },
    {
      id: 'ia',
      title: 'Como isso ajuda a IA',
      paragraphs: [
        'O agente pode consultar o ID compartilhado e distinguir a aba desejada de outras abas com o mesmo título. O grupo, a posição e o layout fornecem contexto para planejar uma organização da tela.',
        'Consultar detalhes não concede permissão para alterar o workspace. Essas alternativas só incluem leitura; não acrescentam comandos para reorganizar abas. Consulte novamente quando o estado mudar.'
      ]
    },
    {
      id: 'escolha',
      title: 'Por que CLI-only, e quando escolher outra alternativa',
      paragraphs: [
        'O comando de leitura layout show mantém o menu curto e consulta o estado no host. A cópia detalhada das outras alternativas usa o mesmo formato de localização.',
        'O custo é exigir acesso a um CLI conectado ao Orca. Para compartilhar todos os detalhes em uma única colagem sem pedir ao destinatário que execute um comando, as alternativas Details e dois botões são mais adequadas.'
      ]
    },
    {
      id: 'validacao',
      title: 'Escopo e evidências',
      items: [
        'O commit CLI-only preserva o menu do PR #1 e inclui o JSON e o CLI de leitura. Passaram 26 testes focados; nas alternativas #6 e #7, passaram 34 testes cada. Typechecks de runtime, CLI e renderer, catálogo RPC e gate de qualidade também passaram.',
        'A gravação mostra o aplicativo completo e o menu sem Copy Tab Details. Foi feita antes da reconstrução da branch e não demonstra a nova implementação do CLI.',
        'A documentação descreve o contrato do comando e do layout a partir do código. Não afirma que macOS, Windows, SSH ou CI completo foram executados nesta revisão.',
        'Alternativa publicada no PR #5 de fabricedge/orca, como rascunho diretamente sobre o PR #1, com um único commit que pode ser aplicado por cherry-pick. Os commits agora têm referências públicas; o PR permanece pendente de seleção e das verificações descritas no GitHub.'
      ]
    }
  ],
  'split-control': [
    {
      id: 'comportamento',
      title: 'Uma linha, duas ações independentes',
      paragraphs: [
        'O lado principal copia apenas orcaTabId: <id>. O hint Details, à direita, copia o JSON existente com contexto do workspace e a localização da aba. Clicar na linha normal não deve copiar detalhes por acidente.',
        'As ações continuam sendo itens reais do menu, com navegação por teclado. O controle reutiliza o fluxo de clipboard e de leitura de detalhes; não cria um botão aninhado nem um segundo formato de dados.'
      ]
    },
    {
      id: 'contexto',
      title: 'Tooltip e confirmação',
      items: [
        'O tooltip explica que o ID pode ser compartilhado com uma IA para localizar e organizar a aba; Details inclui posição e layout.',
        'A cópia normal confirma Tab ID copied. A detalhada confirma Detailed tab ID copied, no canto inferior direito, somente após sucesso no clipboard.',
        'Um único commit sobre o PR #1 inclui JSON, CLI de leitura, controle, notificações e tooltip. Pode ser aplicado por cherry-pick sem os PRs #2, #3 ou #4.'
      ]
    },
    {
      id: 'tradeoff',
      title: 'Por que escolher o hint Details',
      paragraphs: [
        'Mantém a ação normal em destaque e aproxima a alternativa detalhada sem acrescentar outra linha ao menu. Ocupa menos espaço que dois rótulos completos.',
        'O rótulo compacto exige a explicação no hover. Se a prioridade for tornar as duas ações igualmente explícitas, prefira a versão com duas colunas. O JSON copiado é um retrato do momento da cópia, não uma atualização contínua do layout.'
      ]
    }
  ],
  'two-columns': [
    {
      id: 'comportamento',
      title: 'Dois rótulos completos no menu',
      paragraphs: [
        'Copy Tab ID e Copy Tab Details aparecem lado a lado. O primeiro copia o identificador; o segundo copia o JSON de detalhes. Cada item mantém seu próprio handler e acesso por teclado.',
        'A mesma composição aparece nos menus de abas de navegador, arquivo e terminal, preservando a identidade da aba clicada.'
      ]
    },
    {
      id: 'contexto',
      title: 'Instruções curtas e feedback',
      items: [
        'O hover explica que a cópia serve para dar contexto à IA sobre a aba. A opção detalhada inclui sua posição e o layout do workspace.',
        'Cada ação mostra uma confirmação específica após sucesso no clipboard. Falhas continuam no tratamento de erro existente.',
        'Um único commit sobre o PR #1 inclui JSON, CLI de leitura, layout, notificações e tooltip. A gravação anterior à reconstrução permite comparar os controles; não é uma nova validação completa da branch.'
      ]
    },
    {
      id: 'tradeoff',
      title: 'Por que escolher duas colunas',
      paragraphs: [
        'Os rótulos completos tornam as duas opções visíveis sem depender de descobrir o significado de Details. O custo é uma linha mais larga no menu.',
        'Esta versão é uma alternativa ao hint, não uma alteração acumulada sobre ele. Se os detalhes puderem ser consultados pelo agente no host, CLI-only mantém o menu mais simples. Copiar detalhes não move a aba nem concede controle sobre o workspace.'
      ]
    }
  ]
}
