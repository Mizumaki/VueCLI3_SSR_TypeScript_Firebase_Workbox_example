import stathamApi from '../../api/statham';

// initial state
const state = {
  movies: [],
}

// getters
const getters = {}

// actions
const actions = {
  getMovies({ commit }: any) {
    return stathamApi.fetchMovies()
      .then((movies: any) => {
        commit('setMovieList', movies);
      });
  }
}

// mutations
const mutations = {
  setMovieList(state: any, movies: any) {
    state.movies = movies;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}