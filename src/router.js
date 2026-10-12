import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
} from "vue-router";
import IndexPage from "./pages/IndexPage.vue";
import ArticlePage from "./pages/ArticlePage.vue";
import SourcesPage from "./pages/SourcesPage.vue";
import WorkflowPage from "./pages/WorkflowPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";
export function makeRouter(ssr = false) {
  return createRouter({
    history: ssr
      ? createMemoryHistory(import.meta.env.BASE_URL)
      : createWebHistory(import.meta.env.BASE_URL),
    routes: [
      { path: "/", component: IndexPage },
      { path: "/:locale(en|pt-BR)", component: IndexPage },
      ...["overview", "news", "changes"].map((view) => ({
        path: `/:locale(en|pt-BR)/${view}`,
        component: IndexPage,
        meta: { view },
      })),
      { path: "/revisoes", component: IndexPage, meta: { view: "changes" } },
      { path: "/revisoes/:slug", component: ArticlePage },
      { path: "/:locale(en|pt-BR)/changes/:slug", component: ArticlePage },
      { path: "/:locale(en|pt-BR)/sources", component: SourcesPage },
      { path: "/:locale(en|pt-BR)/tab-copy", component: ArticlePage },
      { path: "/:locale(en|pt-BR)/workflow", component: WorkflowPage },
      { path: "/:pathMatch(.*)*", component: NotFoundPage },
    ],
    scrollBehavior(to, from, saved) {
      return saved || (to.hash ? { el: to.hash, top: 80 } : { top: 0 });
    },
  });
}
