const homeComponent = () => import('@/views/home/index.vue')
const mainComponent = () => import('@/views/home/main/index.vue')
const resourceComponent = () => import('@/views/home/resource/index.vue')
const myComponent = () => import('@/views/home/my/index.vue')
const gridComponent = () => import('@/views/home/grid/index.vue')
const routes = [
    {
        path: '/home',
        name: 'home',
        redirect:'/home/main',
        component: homeComponent,
        children:[{
          path:'/home/main',
          name:'main',
          component:mainComponent
        },{
          path:'/home/resource',
          name:'resource',
          component:resourceComponent
        },{
          path:'/home/my',
          name:'my',
          component:myComponent
        },{
          path:'/home/grid',
          name:'grid',
          component:gridComponent
        },]
    },
]
export default routes