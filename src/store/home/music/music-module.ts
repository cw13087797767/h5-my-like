import musicType from './music-type'

const state:musicType = {
    musicCurrentTime:0,
    musicMaxTime:0
}

const mutations = {
    set_musicCurrentTime(state:any,payload:any){
        state.musicCurrentTime = payload
    },
    set_musicMaxTime(state:any,payload:any){
        state.musicMaxTime = payload
    },
}

export default {
    state,
    mutations
}