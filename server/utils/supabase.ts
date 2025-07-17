import { createClient } from '@supabase/supabase-js'
// Get runtime config
const config = useRuntimeConfig()
// Create Supabase client for server-side usage
export const supabase = createClient(
  config.public.supabaseUrl,
  config.supabaseServiceKey, // Use service key for server-side operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
// Backward compatibility: SQL template function that uses Supabase
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  // Convert template literal to a simple query
  let query = strings[0]
  // Replace placeholders with actual values
  for (let i = 0; i < values.length; i++) {
    query = query.replace('${' + (i + 1) + '}', values[i])
  }
  // This is a simplified approach - you might want to use Supabase's query builder instead
  // For now, we'll throw an error to encourage migration to Supabase client methods
  throw new Error('Direct SQL queries not supported with Supabase client. Please use Supabase query methods.')
}





