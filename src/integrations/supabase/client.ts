// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qeuvbyajwdqcwwrpuigz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFldXZieWFqd2RxY3d3cnB1aWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTg0MjEsImV4cCI6MjA2MDc3NDQyMX0.7QNBU8jkLyj8VYyGe6IkFNTUgTn-zN53pJCqRcOWfa4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);