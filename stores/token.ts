import { defineStore } from 'pinia'

export const useTokenStore = defineStore('token', {
  state: () => ({
    jwtToken: null as string | null
  }),
  actions: {
    setToken(token: string) {
      this.jwtToken = token
    },
    clearToken() {
      this.jwtToken = null
    }
  }
})
