
import { supabase } from "@/integrations/supabase/client";

// Interface pour les utilisateurs
export interface User {
  id: string;
  email: string;
  role: "admin" | "comptable" | "assistant";
  collaborateur_id: string | null;
  created_at: string;
}

// Récupérer tous les utilisateurs
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*");

    if (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      throw error;
    }

    return data as User[];
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error;
  }
};

// Créer un nouvel utilisateur (version administrateur)
export const createUser = async (email: string, password: string, role: "admin" | "comptable" | "assistant", collaborateur_id?: string): Promise<User> => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase());

    if (checkError) {
      console.error("Erreur lors de la vérification de l'utilisateur:", checkError);
      throw checkError;
    }

    if (existingUsers && existingUsers.length > 0) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    // Créer l'utilisateur dans auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
    });

    if (authError) {
      console.error("Erreur lors de la création de l'utilisateur auth:", authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }

    // Ajouter l'utilisateur dans la table users
    const userData = {
      id: authData.user.id,
      email: email.toLowerCase(),
      role,
      collaborateur_id: collaborateur_id || null,
      password: "**********" // On ne stocke pas le mot de passe en clair, c'est Supabase Auth qui le gère
    };

    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      throw error;
    }

    return data as User;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    throw error;
  }
};

// Récupérer les identifiants de connexion existants
export const getExistingCredentials = async (): Promise<{email: string, role: string}[]> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("email, role");

    if (error) {
      console.error("Erreur lors de la récupération des identifiants:", error);
      throw error;
    }

    return data as {email: string, role: string}[];
  } catch (error) {
    console.error("Erreur lors de la récupération des identifiants:", error);
    throw error;
  }
};
