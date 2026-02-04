/**
 * CLIENTE SUPABASE PARA O FRONTEND
 * 
 * Inicializa o cliente Supabase para autenticação OAuth
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dqyzhkftlwecimnnjiim.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxeXpoa2Z0bHdlY2ltbm5qaWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1Nzg2NjIsImV4cCI6MjA1NTE1NDY2Mn0.Wkm4KCh1LqiCdVrj1IMDPpSJjyGjKV3xk5tOobxGV7I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
