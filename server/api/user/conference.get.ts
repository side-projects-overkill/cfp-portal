import { supabase } from '~/server/utils/supabase'

export default defineEventHandler (async () => {
  const {data, error} = await supabase
   .from('conferences')
   .select('title,event_date,close_date,close_time')

   if (error) {
    return {
      status: 'error',
      error: error.message
    }
   }

   const now = new Date();
   const openConferences = data.filter( conf => new Date(conf.close_time) > now);

   return {
    openConferences 
   }
})