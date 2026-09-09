/* ==========================================================================
   AppGym — configuración de servicios externos
   --------------------------------------------------------------------------
   Estos valores son PÚBLICOS por diseño: viajan al navegador de cada visitante
   igual que cualquier otro asset del sitio. Lo que protege los datos es la
   Row Level Security de Supabase (cada usuario sólo lee/escribe su propia fila).
   NUNCA poner acá la service_role key, el password de la base, ni el client
   secret de Google OAuth (ese vive sólo en el panel de Supabase).
   ========================================================================== */
window.AppGymConfig = {
  supabaseUrl: "https://voperpqopmruelglbrpg.supabase.co",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvcGVycHFvcG1ydWVsZ2xicnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MTAzMjcsImV4cCI6MjEwNDQ4NjMyN30.2lQ83YXUODm_2IQtEiWQUs_eZIMjE1L8ftS53KgVvj8"
};
