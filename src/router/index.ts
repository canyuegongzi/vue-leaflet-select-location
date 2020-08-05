import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    {
        path: '/',
        redirect: {
            name: 'example',
        },
    },
    {
        path: '/example',
        name: 'example',
        component: () => import('../views/example/Index.vue'),
    },
];

const router = new VueRouter({
    mode: 'hash',
    routes,
});

export default router;
