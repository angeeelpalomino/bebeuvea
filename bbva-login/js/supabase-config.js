// js/supabase-config.js
const supabaseUrl = 'https://fvgnufpaubacivfdgbcc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2Z251ZnBhdWJhY2l2ZmRnYmNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1OTA1MTYsImV4cCI6MjA5NDE2NjUxNn0.dru4-DdqupEsCXFb4VQMNKEMAh3F1c3pMjEhvkdcKC8';

const { createClient } = supabase;
window.supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
console.log("✅ Supabase inicializado correctamente");