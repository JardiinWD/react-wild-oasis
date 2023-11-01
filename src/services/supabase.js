
import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://atdubmvtwbpcbkkhvlam.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0ZHVibXZ0d2JwY2Jra2h2bGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg1OTgyNjIsImV4cCI6MjAxNDE3NDI2Mn0.VUQRURhgV7hauPE8MsSzG10KL4Evih5psg1oDZCmm-U"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;