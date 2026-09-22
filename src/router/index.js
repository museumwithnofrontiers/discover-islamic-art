import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
// import CollectionEntrance from '../views/CollectionEntrance.vue'
// import CollectionResults from '../views/CollectionResults.vue'
// import Database from '../views/Database.vue'
// import DatabaseResults from '../views/DatabaseResults.vue'
// import TimelineEntrance from '../views/TimelineEntrance.vue'
// import TimelineResults from '../views/TimelineResults.vue'
import PartnersList from "../views/PartnersList.vue";
import PartnerProfile from "../views/PartnerProfile.vue";
// import PartnersResults from '../views/PartnersResults.vue'
// import Dynasties from '../views/Dynasties.vue'
// import DynastyDetail from '../views/DynastyDetail.vue'
// import ItemDetail from '../views/ItemDetail.vue'
// import ArtIntroEntrance from '../views/ArtIntroEntrance.vue'
// import ArtIntroTheme from '../views/ArtIntroTheme.vue'
// import ExhibitionsEntrance from '../views/ExhibitionsEntrance.vue'
// import ExhibitionSplash from '../views/ExhibitionSplash.vue'
// import ExhibitionIntroduction from '../views/ExhibitionIntroduction.vue'
// import ExhibitionTheme from '../views/ExhibitionTheme.vue'

const routes = [
  { path: "/", component: HomePage },
  // { path: '/collection', component: CollectionEntrance },
  // { path: '/collection/results', component: CollectionResults },
  // { path: '/database', component: Database },
  // { path: '/database/results', component: DatabaseResults },
  // { path: '/timeline', component: TimelineEntrance },
  // { path: '/timeline/results', component: TimelineResults },
  { path: "/partners", component: PartnersList },
  { path: "/partner/:id", name: "partner-profile", component: PartnerProfile },
  // { path: '/partners/results', component: PartnersResults },
  // { path: '/dynasties', component: Dynasties },
  // { path: '/dynasty/:id', component: DynastyDetail },
  // { path: '/artistic-introduction', component: ArtIntroEntrance },
  // { path: '/artistic-introduction/:themeId', component: ArtIntroTheme },
  // { path: '/exhibitions', component: ExhibitionsEntrance },
  // { path: '/exhibitions/:exhibitionId', component: ExhibitionSplash },
  // { path: '/exhibitions/:exhibitionId/introduction', component: ExhibitionIntroduction },
  // { path: '/exhibitions/:exhibitionId/theme/:themeId', component: ExhibitionTheme },
  // { path: '/item/:id', component: ItemDetail },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});
