
import { toast } from "@/hooks/use-toast";

/**
 * Standardized error handling function for service calls
 * @param error The error that occurred
 * @param defaultMessage Default message to show when error doesn't have a message
 * @param context Additional context about where the error occurred
 */
export function handleError(error: unknown, defaultMessage: string, context?: string): void {
  const contextPrefix = context ? `[${context}] ` : '';
  
  // Log for debugging
  console.error(`${contextPrefix}${defaultMessage}`, error);
  
  // Extract the most useful message to display to users
  let displayMessage = defaultMessage;
  
  if (error instanceof Error) {
    displayMessage = error.message;
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    displayMessage = (error as any).message;
  }
  
  // Show toast notification
  toast({
    title: "Erreur",
    description: displayMessage,
    variant: "destructive",
  });
}

/**
 * Creates a standardized onError handler for mutations
 * @param defaultMessage Default message to show
 * @param context Context where the error happened
 */
export function createErrorHandler(defaultMessage: string, context?: string) {
  return (error: unknown) => handleError(error, defaultMessage, context);
}
