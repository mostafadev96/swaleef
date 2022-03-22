import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import JSONHeader, { APIURL } from './Constants'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: localStorage.getItem('user') || {},
        lang: localStorage.getItem('lang') || 'en',
    },
    mutations: {
        auth_request(state) {
            state.status = 'loading'
        },
        auth_success(state, token, user) {
            state.status = 'success'
            state.token = token
            state.user = user
        },
        updated_success(state,user){
            state.user = user
        },
        auth_error(state) {
            state.status = 'error'
        },
        logout(state) {
            state.status = ''
            state.token = ''
            state.user = {}
        },
        commit_lang(state,lang){
            state.lang = lang
        }
    },
    actions: {
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios({ url: APIURL + 'login', data: user, method: 'POST', headers: JSONHeader })
                    .then(resp => {
                        if (resp.data.success) {
                            const token = resp.data.data.token.access_token
                            const user = resp.data.data.user
                            console.log(user);
                            localStorage.setItem('token', token);
                            localStorage.setItem('user', JSON.stringify(user));
                            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                            // commit('auth_success', token, user)
                            console.log(token);

                        }
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('auth_error')
                        localStorage.removeItem('token')
                        reject(err)
                    })
            })
        },
        register({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios({ url: APIURL + 'register', data: user, method: 'POST', headers: JSONHeader })
                    .then(resp => {
                        if (resp.data.success) {
                            const token = resp.data.data.token.access_token
                            const user = resp.data.data.user
                            localStorage.setItem('token', token)
                            localStorage.setItem('user', JSON.stringify(user));
                            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                            // commit('auth_success', token, user)
                        }
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('auth_error', err)
                        localStorage.removeItem('token')
                        reject(err)
                    })
            })
        },
        updateProfile({ commit }, formData) {
            commit('auth_request')
            let config = {
                header : {
                 'Content-Type' : 'multipart/form-data'
               }
            }
            let url = APIURL + 'update-profile';
            return new Promise((resolve, reject) => {
                axios.post(url, formData, config )
                    .then(resp => {
                        if (resp.data.success) {
                            const user = resp.data.data.User
                            localStorage.setItem('user', JSON.stringify(user));
                            // commit('updated_success', user)
                        }
                        resolve(resp.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        logout({ commit }) {
            return new Promise((resolve) => {
                commit('logout')
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                delete axios.defaults.headers.common['Authorization']
                resolve()
            })
        },
        changeLanguage({ commit },lang) {
            commit('auth_request')
            localStorage.setItem('lang', lang)
        },
    },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        getLang: state => state.lang,
        curr_user: state => {
            console.log(state.user)
            return JSON.parse(state.user)
        },
    }
})