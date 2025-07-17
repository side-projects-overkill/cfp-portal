import { supabase } from '~/server/utils/supabase';
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    // Check if config is properly set
    if (!config.public.supabaseUrl) {
      return {
        status: 'error',
        message: 'SUPABASE_URL environment variable is not set',
        config_check: {
          supabase_url: 'Missing',
          supabase_anon_key: config.public.supabaseKey ? 'Set' : 'Missing',
          supabase_service_key: config.supabaseServiceKey ? 'Set' : 'Missing',
          jwt_secret: config.jwtSecret ? 'Set' : 'Missing'
        }
      };
    }
    // Test basic connection by checking database info
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);
    if (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        config_check: {
          supabase_url: config.public.supabaseUrl ? 'Set' : 'Missing',
          supabase_anon_key: config.public.supabaseKey ? 'Set' : 'Missing',
          supabase_service_key: config.supabaseServiceKey ? 'Set' : 'Missing',
          jwt_secret: config.jwtSecret ? 'Set' : 'Missing'
        }
      };
    }
    const userTableExists = data?.some(table => table.table_name === 'users');
    return {
      status: 'success',
      message: 'Supabase connection successful',
      database_info: {
        connection: 'OK',
        tables_found: data?.length || 0,
        users_table_exists: userTableExists,
        available_tables: data?.map(t => t.table_name) || []
      },
      config_check: {
        supabase_url: config.public.supabaseUrl ? 'Set' : 'Missing',
        supabase_anon_key: config.public.supabaseKey ? 'Set' : 'Missing',
        supabase_service_key: config.supabaseServiceKey ? 'Set' : 'Missing',
        jwt_secret: config.jwtSecret ? 'Set' : 'Missing'
      },
      next_steps: userTableExists ?
        'Users table exists! You can test /api/test/supabase' :
        'Create users table using SQL from SUPABASE_SETUP.md',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      config_check: {
        supabase_url: useRuntimeConfig().public.supabaseUrl ? 'Set' : 'Missing',
        supabase_anon_key: useRuntimeConfig().public.supabaseKey ? 'Set' : 'Missing',
        supabase_service_key: useRuntimeConfig().supabaseServiceKey ? 'Set' : 'Missing',
        jwt_secret: useRuntimeConfig().jwtSecret ? 'Set' : 'Missing'
      }
    };
  }
});