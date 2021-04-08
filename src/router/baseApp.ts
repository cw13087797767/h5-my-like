const baseAppHome = () => import("@/views/baseApp/home.vue")
const baseAppUploadImg = () => import("@/views/baseApp/uploadImg/index.vue")
const baseAppSpaceMySpace = () => import("@/views/baseApp/space/mySpace/index.vue")
const baseAppSpaceEditSpace = () => import("@/views/baseApp/space/editSpace/index.vue")
const baseAppSpaceSpaceDetail = () => import("@/views/baseApp/space/spaceDetail/index.vue")
const routes = [
    {
        path:'/baseApp',
        name:'baseAppHome',
        component:baseAppHome,
        children:[
            {
                path:'/baseApp/uploadImg',
                name:'baseAppUploadImg',
                component:baseAppUploadImg
            },
            // 我的空间
            {
                path:'/baseApp/space/mySpace',
                name:'baseAppSpaceMySpace',
                component:baseAppSpaceMySpace,
            },
            // 编辑日志
            {
                path:'/baseApp/space/editSpace',
                name:'baseAppSpaceEditSpace',
                component:baseAppSpaceEditSpace,
            },
            // 日志详情
            {
                path:'/baseApp/space/spaceDetail',
                name:'baseAppSpaceSpaceDetail',
                component:baseAppSpaceSpaceDetail,
            },
        ]
    }
]
export default routes