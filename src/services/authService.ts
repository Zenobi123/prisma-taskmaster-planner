
import { supabase } from "@/integrations/supabase/client";

export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password.trim()
    });

    if (error) {
      console.error("Erreur d'authentification:", error);
      
      // Si l'utilisateur n'existe pas dans auth mais pourrait exister dans users
      // On vérifie si c'est l'un de nos comptes prédéfinis
      if (error.message.includes("Invalid login credentials") && 
         (email.toLowerCase() === "comptable@prisma.com" || email.toLowerCase() === "admin@prisma.com")) {
        
        // Vérifier si l'utilisateur existe dans la table users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email.toLowerCase())
          .single();
        
        if (userError) {
          console.error("Erreur lors de la vérification de l'utilisateur:", userError);
          throw error;
        }
        
        if (userData) {
          // Utilisateur trouvé dans la table users, mais pas dans auth
          // On vérifie le mot de passe (dans un cas réel, vous utiliseriez bcrypt)
          if ((email.toLowerCase() === "comptable@prisma.com" && password === "Medaille-123") ||
              (email.toLowerCase() === "admin@prisma.com" && password === "Admin-123")) {
            
            console.log("Connexion réussie via vérification manuelle pour:", email);
            
            // Retourner une structure similaire à celle de Supabase Auth
            return {
              data: {
                user: { 
                  id: userData.id,
                  email: userData.email,
                  role: userData.role
                },
                session: {
                  access_token: "demo_token" // Jeton factice pour la démo
                }
              },
              error: null
            };
          }
        }
      }
      
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw error;
  }
};

export const getUserRole = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Erreur lors de la récupération du rôle:", error);
      throw error;
    }
    
    return data.role;
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle:", error);
    throw error;
  }
};
