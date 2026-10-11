export const locales = ['en', 'pt-BR']
export const defaultLocale = 'en'
export const languageNames = { en: 'English', 'pt-BR': 'Português' }
export function localePath(locale) {
  return `/${locale}/tab-copy`
}
const en = {
  title: 'Orca changes',
  description: 'Videos, screenshots and commits for reviewing Orca changes.',
  skip: 'Skip to versions',
  brand: 'Orca / changes',
  reviews: 'Reviews',
  tabCopy: 'Tab copy',
  language: 'Language',
  eyebrow: 'Interface review',
  heading: 'Three ways to copy a tab.',
  intro: 'Compare the actions, AI instructions and notifications in each version.',
  fullCapture: 'Recordings of the complete Orca app. These versions are alternatives.',
  isolatedCapture:
    'The older videos only show isolated menus. They are hidden until recordings of the complete Orca app are available.',
  versions: 'Versions',
  download: 'Download video',
  copied: 'View copy result',
  screenshots: 'View screenshots',
  menu: 'Tab menu',
  tooltip: 'Instructions for the agent',
  newRecordings: 'New recordings? Run',
  refresh: 'and refresh the page.',
  back: 'Back to versions',
  missingVideo: 'A recording of the complete Orca app is not available yet.',
  record: 'Run npm run record:orca, then',
  demo: 'Demo',
  unsupported: 'Your browser cannot play this video. Use the download link below.',
  failedVideo: 'Could not play the video.',
  downloadWebm: 'Download the WebM file',
  watch: 'to watch it.',
  errorTitle: 'Could not load the media.',
  errorBody: 'Check the file import and try again.',
  retry: 'Try again',
  loading: 'Loading Orca recordings…',
  variants: [
    {
      title: 'Details through the CLI',
      description: 'The menu copies the tab ID. Details are available through the Orca command.',
      behavior:
        'Opens the menu, copies the ID and shows confirmation. The CLI query is not run in this demo.',
      commits: ['Tab details through the CLI']
    },
    {
      title: 'Copy with a Details hint',
      description: 'One copy row, with Details on the right to include position and layout.',
      behavior:
        'Opens the menu, shows the tooltip, copies the ID and then the details. Each copy has its own confirmation.',
      commits: ['Control with a Details hint', 'Copy notifications', 'Tooltip about AI context']
    },
    {
      title: 'Two buttons in columns',
      description:
        'Copy Tab ID and Copy Tab Details sit side by side, with a short instruction on hover.',
      behavior:
        'Shows both actions, the tooltip and confirmations for normal and detailed copying.',
      commits: ['Two-column menu', 'Copy notifications', 'Short AI instruction']
    }
  ]
}
const pt = {
  title: 'Mudanças do Orca',
  description: 'Vídeos, capturas e commits para revisar mudanças do Orca.',
  skip: 'Pular para as versões',
  brand: 'Orca / mudanças',
  reviews: 'Revisões',
  tabCopy: 'Cópia de abas',
  language: 'Idioma',
  eyebrow: 'Revisão de interface',
  heading: 'Três formas de copiar uma aba.',
  intro: 'Compare as ações, as instruções para IA e as notificações de cada versão.',
  fullCapture: 'Gravações do aplicativo Orca completo. As versões são alternativas entre si.',
  isolatedCapture:
    'Os vídeos antigos mostram apenas menus isolados. Eles ficam ocultos até haver gravações do aplicativo Orca completo.',
  versions: 'Versões',
  download: 'Baixar vídeo',
  copied: 'Ver resultado da cópia',
  screenshots: 'Ver capturas',
  menu: 'Menu da aba',
  tooltip: 'Instrução para o agente',
  newRecordings: 'Novas gravações? Execute',
  refresh: 'e atualize a página.',
  back: 'Voltar às versões',
  missingVideo: 'Ainda não há gravação do aplicativo Orca completo.',
  record: 'Execute npm run record:orca e depois',
  demo: 'Demonstração',
  unsupported: 'Seu navegador não reproduz este vídeo. Use o link de download abaixo.',
  failedVideo: 'Não foi possível reproduzir o vídeo.',
  downloadWebm: 'Baixe o arquivo WebM',
  watch: 'para assistir.',
  errorTitle: 'Não foi possível carregar as mídias.',
  errorBody: 'Verifique a importação dos arquivos e tente novamente.',
  retry: 'Tentar novamente',
  loading: 'Carregando as gravações do Orca…',
  variants: [
    {
      title: 'Detalhes pelo CLI',
      description: 'O menu copia o ID da aba. Os detalhes ficam disponíveis pelo comando do Orca.',
      behavior:
        'Abre o menu, copia o ID e mostra a confirmação. A consulta pelo CLI não é executada nesta demonstração.',
      commits: ['Consulta de detalhes pelo CLI']
    },
    {
      title: 'Copy com hint Details',
      description:
        'Uma linha de cópia, com a opção Details à direita para incluir posição e layout.',
      behavior:
        'Abre o menu, mostra o tooltip, copia o ID e depois os detalhes. Cada cópia tem sua própria confirmação.',
      commits: [
        'Controle com hint Details',
        'Notificações de cópia',
        'Tooltip sobre contexto para IA'
      ]
    },
    {
      title: 'Dois botões em colunas',
      description:
        'Copy Tab ID e Copy Tab Details ficam lado a lado, com instrução curta ao passar o mouse.',
      behavior: 'Demonstra as duas ações, o tooltip e as confirmações de cópia normal e detalhada.',
      commits: ['Menu com duas colunas', 'Notificações de cópia', 'Instrução curta para IA']
    }
  ]
}
export function getMessages(locale) {
  return locale === 'pt-BR' ? pt : en
}
