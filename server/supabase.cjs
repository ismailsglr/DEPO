const { createClient } = require('@supabase/supabase-js');

// Supabase bağlantı bilgileri
const supabaseUrl = process.env.SUPABASE_URL || 'https://wuovljnnoqgvxcmejdoj.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1b3Zsam5ub3FndnhjbWVqZG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MzI3MzQsImV4cCI6MjA3MjUwODczNH0.WX7QcyMUgI8Srfm0Nv_T877fukhkMhHeb2aumfMyOqM';

// Supabase client oluştur
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
