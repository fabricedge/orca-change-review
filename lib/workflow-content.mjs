export const workflowContent = {
  en: {
    title: "Show what the Orca test actually did.",
    intro:
      "Orca Review Changes creates evidence pages with automated recordings of the real app and text describing the tested feature, result and limits. These pages complement the GitHub PR review; they never replace it.",
    issueTitle: "When a test reveals a problem",
    steps: [
      "Describe what you were trying to do, what happened, what you expected, and how this blocks your workflow. Keep the problem separate from your preferred solution.",
      "Read the target repository’s current CONTRIBUTING file and issue templates. Search existing issues first; add evidence to an existing report when it describes the same problem.",
      "For a bug, record exact reproduction steps, Orca version, OS and relevant logs or screenshots. Distinguish observed behavior from a suspected cause. Remove credentials and account details.",
      "For a feature, explain the use case, current workaround and why it falls short. Describe the proposed solution and alternatives separately. The Orca templates request English; follow the current target template.",
      "Keep one user problem per issue. Split unrelated changes into linked issues or focused PRs. Add an implementation only when it helps resolve the agreed problem; avoid expanding a PR to collect unrelated improvements.",
      "Review the draft against the repository requirements before opening the issue. A saved draft in Orca Review is not a published GitHub issue.",
    ],
    template: "Open upstream Orca issue templates",
    mcpTitle: "Record an Orca test through MCP",
    mcpBody:
      "Ask record_orca_test to run one Electron E2E spec from the configured Orca checkout. It uses the existing recording fixture, rebuilds the app and captures hidden renderers. Poll get_recording for the video paths, test report and actual outcome. Then save the evidence and explanatory text against a PR, commit or issue with save_review. Publish reviewed video assets to Releases and rebuild Pages.",
    mcpLimit:
      "GitHub Pages hosts static pages. Run the MCP process on your development host; it is not an endpoint on github.io. For SSH work, run it where the target checkout and review data live.",
    setup: "MCP setup and tool reference",
    back: "Browse reviews",
  },
  "pt-BR": {
    title: "Mostre o que o teste do Orca realmente fez.",
    intro:
      "O Orca Review Changes cria páginas de evidências com gravações automatizadas do app real e texto sobre a feature, o resultado e os limites do teste. Essas páginas complementam a revisão do PR no GitHub; nunca a substituem.",
    issueTitle: "Quando um teste revela um problema",
    steps: [
      "Descreva o que você tentava fazer, o que aconteceu, o resultado esperado e como isso atrapalha seu workflow. Separe o problema da solução que você prefere.",
      "Leia o CONTRIBUTING e os templates atuais do repositório de destino. Busque issues existentes; acrescente evidências a um relato existente quando for o mesmo problema.",
      "Para um bug, registre passos exatos para reproduzir, versão do Orca, sistema operacional e logs ou capturas relevantes. Separe o comportamento observado de uma causa suspeita. Remova credenciais e dados de conta.",
      "Para uma feature, explique o caso de uso, a alternativa atual e sua limitação. Descreva proposta e alternativas separadamente. Os templates do Orca pedem inglês; siga o template atual do destino.",
      "Mantenha um problema do usuário por issue. Separe mudanças independentes em issues relacionadas ou PRs focados. Uma implementação deve resolver o problema acordado; evite acumular melhorias sem relação no mesmo PR.",
      "Revise o rascunho pelas exigências do repositório antes de abrir a issue. Salvar no Orca Review não publica uma issue no GitHub.",
    ],
    template: "Abrir templates de issue do Orca upstream",
    mcpTitle: "Grave um teste do Orca pelo MCP",
    mcpBody:
      "Peça ao record_orca_test para executar um spec E2E Electron no checkout Orca configurado. Ele reutiliza o fixture de gravação, recompila o app e captura renderers ocultos. Consulte get_recording para obter vídeos, relatório e resultado real. Depois, use save_review para vincular evidências e texto a um PR, commit ou issue. Publique os vídeos revisados em Releases e gere novamente o Pages.",
    mcpLimit:
      "GitHub Pages hospeda páginas estáticas. Execute o MCP no host de desenvolvimento; ele não é um endpoint no github.io. Em SSH, execute onde estão o checkout de destino e os registros.",
    setup: "Configurar MCP e consultar ferramentas",
    back: "Ver revisões",
  },
};
