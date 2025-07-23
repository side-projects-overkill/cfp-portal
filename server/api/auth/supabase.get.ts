import { supabase } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  const { data, error, count } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .limit(1)

  if (error) {
    return {
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    }
  }

  return {
    status: 'success',
    message: 'Supabase connection successful',
    total_users: count || 0,
    sample_data_count: data?.length || 0,
    timestamp: new Date().toISOString()
  }
})
