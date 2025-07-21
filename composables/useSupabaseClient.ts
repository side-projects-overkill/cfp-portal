export const useSupabaseClient = () => {
  return useNuxtApp().$supabase
}
