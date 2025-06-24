
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://tdfblmxrnhjqlyyrgjzu.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkZmJsbXhybmhqcWx5eXJnanp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NTkyMzMsImV4cCI6MjA2MjMzNTIzM30.2XSOG7wFV9Bc7ZhZV9mLp2IbytX_OQ9CTUc1xN3Bibg"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
