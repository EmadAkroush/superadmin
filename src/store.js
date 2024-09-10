import { createStore } from 'vuex'


export const store = createStore({
    state () {
      return {
        TemplateEdit: {} ,
        CategoryName: '' , 
        MusicEdit: ''
      }
    },
    mutations: {
      increment (state) {
        state.count++
        
      }
    }
  })