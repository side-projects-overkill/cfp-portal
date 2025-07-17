import { supabase } from '~/server/utils/supabase';
export default defineEventHandler(async (event) => {
  try {
    // Test basic connection - try to count users
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .limit(1);
    const config = useRuntimeConfig();
    if (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        hint: error.code === 'PGRST106' ? 'Table "users" does not exist. Please create it using the SQL in SUPABASE_SETUP.md' : 'Check your Supabase credentials and database connection',
        config_check: {
          supabase_url: config.public.supabaseUrl ? 'Set' : 'Missing',
          supabase_anon_key: config.public.supabaseKey ? 'Set' : 'Missing',
          supabase_service_key: config.supabaseServiceKey ? 'Set' : 'Missing',
          jwt_secret: config.jwtSecret ? 'Set' : 'Missing'
        }
      };
    }
    return {
      status: 'success',
      message: 'Supabase connection successful',
      database_info: {
        users_table_exists: true,
        total_users: count || 0,
        sample_data: data?.length || 0
      },
      config_check: {
        supabase_url: config.public.supabaseUrl ? 'Set' : 'Missing',
        supabase_anon_key: config.public.supabaseKey ? 'Set' : 'Missing',
        supabase_service_key: config.supabaseServiceKey ? 'Set' : 'Missing',
        jwt_secret: config.jwtSecret ? 'Set' : 'Missing'
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});









