const registerComponent = () => import('@/components/user/register.vue')
const resetComponent = () => import('@/components/user/reset.vue')
const userComponent = () => import('@/views/user/index.vue')
const loginComponent = () => import('@/components/user/login.vue')

const routes = [
    {
        path: '/user',
        name: 'user',
        component:userComponent,
        children:[{
          path:'/user/register',
          name:'register',
          component:registerComponent
        },{
          path:'/user/login',
          name:'login',
          component:loginComponent
        },{
          path:'/user/reset',
          name:'reset',
          component:resetComponent
        },
        ]
    },
]
export default routes