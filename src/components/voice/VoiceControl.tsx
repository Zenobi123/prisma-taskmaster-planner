
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceControlProps {
  onCommand: (command: string, transcript: string) => void;
  isEnabled?: boolean;
  className?: string;
}

export const VoiceControl = ({ onCommand, isEnabled = true, className = "" }: VoiceControlProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Check for browser support
  useEffect(() => {
    const checkSupport = () => {
      if (typeof window !== 'undefined') {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          setIsSupported(true);
        } else {
          setIsSupported(false);
          toast({
            title: "Non supporté",
            description: "La reconnaissance vocale n'est pas supportée par ce navigateur",
            variant: "destructive",
          });
        }
      }
    };

    checkSupport();
  }, [toast]);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported || typeof window === 'undefined') return;

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Voice recognition started');
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);

        if (finalTranscript) {
          processCommand(finalTranscript.trim().toLowerCase());
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error !== 'no-speech') {
          toast({
            title: "Erreur de reconnaissance",
            description: `Erreur: ${event.error}`,
            variant: "destructive",
          });
        }
      };

      recognition.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSupported, toast]);

  const processCommand = useCallback((transcript: string) => {
    console.log('Processing voice command:', transcript);
    
    try {
      // Parse different types of commands
      if (transcript.includes('rechercher') || transcript.includes('chercher')) {
        const searchTerm = transcript.replace(/^(rechercher|chercher)\s+/, '');
        onCommand('search', searchTerm);
      } else if (transcript.includes('filtrer par statut')) {
        const status = extractStatus(transcript);
        if (status) {
          onCommand('filter-status', status);
        }
      } else if (transcript.includes('nouvelle mission')) {
        onCommand('new-mission', transcript);
      } else if (transcript.includes('page suivante')) {
        onCommand('next-page', transcript);
      } else if (transcript.includes('page précédente')) {
        onCommand('prev-page', transcript);
      } else if (transcript.includes('effacer filtres') || transcript.includes('réinitialiser filtres')) {
        onCommand('clear-filters', transcript);
      } else if (transcript.includes('aide')) {
        onCommand('help', transcript);
      } else {
        // Generic command
        onCommand('generic', transcript);
      }
    } catch (error) {
      console.error('Error processing command:', error);
    }
  }, [onCommand]);

  const extractStatus = (transcript: string): string | null => {
    if (transcript.includes('en cours')) return 'en_cours';
    if (transcript.includes('terminé') || transcript.includes('terminée')) return 'termine';
    if (transcript.includes('en attente')) return 'en_attente';
    if (transcript.includes('en retard')) return 'en_retard';
    return null;
  };

  const toggleListening = () => {
    if (!isSupported || !isEnabled) return;

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    } else {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Erreur",
          description: "Impossible de démarrer la reconnaissance vocale",
          variant: "destructive",
        });
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        onClick={toggleListening}
        disabled={!isEnabled}
        className={`transition-all duration-200 ${isListening ? 'animate-pulse' : ''}`}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
        {isListening ? 'Arrêter' : 'Commande vocale'}
      </Button>
      
      {transcript && (
        <Badge variant="secondary" className="max-w-xs truncate">
          {transcript}
        </Badge>
      )}
      
      {isListening && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Écoute...</span>
        </div>
      )}
    </div>
  );
};
