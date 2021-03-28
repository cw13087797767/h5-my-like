const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
    // 打包app要加上 baseUrl:'./'
    // baseUrl:'./',
    productionSourceMap:false,
    devServer:{
        port:"8080",
        disableHostCheck:true,
        proxy:{
            '/areas/bound':{
                target:'https://geo.datav.aliyun.com',
                changeOrigin:true,
                ws: true,
                pathRewrite: {
                    '/areas/bound': '/areas/bound'
                }
            },
            '/mylike/api':{
                target:'http://localhost:3000',
                changeOrigin:true,
                ws: true,
                pathRewrite: {
                    '/mylike/api': '/mylike/api'
                }
            }

        }
    },
    configureWebpack: {        
        plugins:[
            // new BundleAnalyzerPlugin()
        ],
        externals: {
            "echarts": "echarts"        //默认是配置引用的库（这里是echarts）暴露出的全局变量
        },
    },
}