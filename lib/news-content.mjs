export function newsMessages(locale = 'en') {
  return locale === 'pt-BR' ? {
    topics: 'Editorias', allTopics: 'Todos os assuntos', sections: { 'tabs-layout': 'Abas e layout', 'remote-services': 'Execução remota e serviços', general: 'Desenvolvimento' },
    edition: 'O registro de desenvolvimento do Orca', title: 'Mudanças em pauta.',
    intro: 'Cada PR, commit e investigação tem uma história. Veja o que mudou, assista aos testes e acompanhe o que ainda precisa de validação.',
    search: 'Buscar notícias', placeholder: 'Título, branch, commit ou PR', type: 'Editoria', allTypes: 'Todas as mudanças',
    filters: 'Resultado e ordem', result: 'Resultado registrado', allResults: 'Todos os resultados',
    passed: 'Teste passou', failed: 'Teste falhou', incomplete: 'Teste incompleto', notRun: 'Sem resultado de teste',
    order: 'Ordenar por', recent: 'Atualizações recentes', oldest: 'Atualizações antigas', alphabetical: 'Título',
    count: 'notícias', of: 'de', empty: 'Nenhuma notícia encontrada', emptyBody: 'Tente outro termo ou remova os filtros.', reset: 'Limpar filtros',
    headline: 'Em destaque', latest: 'Outras mudanças', read: 'Ler matéria', sources: 'PRs, commits e referências',
    updated: 'Atualizada', published: 'Publicada', video: 'Vídeo disponível', noVideo: 'Registro em texto',
    context: 'Sobre esta edição', contextBody: 'Um registro do desenvolvimento, com evidências para conferir o comportamento. A matéria não substitui a revisão adequada do código no repositório.',
    workflow: 'Como gravar uma mudança', source: 'Ver código e instruções', snapshot: 'Datas e resultados refletem os registros salvos. O estado dos PRs não é atualizado automaticamente.'
  } : {
    topics: 'Topics', allTopics: 'All topics', sections: { 'tabs-layout': 'Tabs and layout', 'remote-services': 'Remote execution and services', general: 'Development' },
    edition: 'The Orca development record', title: 'Changes worth a closer look.',
    intro: 'Every PR, commit and investigation has a story. See what changed, watch the tests and follow what still needs validation.',
    search: 'Search stories', placeholder: 'Title, branch, commit or PR', type: 'Section', allTypes: 'All changes',
    filters: 'Test result and order', result: 'Recorded result', allResults: 'All results',
    passed: 'Test passed', failed: 'Test failed', incomplete: 'Test incomplete', notRun: 'No test result recorded',
    order: 'Sort by', recent: 'Recently updated', oldest: 'Oldest updates', alphabetical: 'Title',
    count: 'stories', of: 'of', empty: 'No stories found', emptyBody: 'Try another search or clear the filters.', reset: 'Clear filters',
    headline: 'In focus', latest: 'More changes', read: 'Read the story', sources: 'PRs, commits and references',
    updated: 'Updated', published: 'Published', video: 'Video available', noVideo: 'Text report',
    context: 'About this edition', contextBody: 'A development record with evidence you can inspect. A story does not replace proper code review in the source repository.',
    workflow: 'How to record a change', source: 'Source and instructions', snapshot: 'Dates and results reflect saved records. PR status is not updated automatically.'
  }
}

export function storyDate(value, locale = 'en') {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value))
}
