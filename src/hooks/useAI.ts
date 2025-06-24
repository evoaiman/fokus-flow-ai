
import { supabase } from "@/integrations/supabase/client";

interface AIResponse {
  message: string;
  action: 'create_task' | 'create_event' | 'setup_profile' | null;
  data: any;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useAI = () => {
  const generateResponse = async (userMessage: string, messageHistory: Message[]): Promise<AIResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message: userMessage,
          context: messageHistory.slice(-10) // Send last 10 messages for context
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error calling AI function:', error);
      return {
        message: "I'm having trouble processing your request right now. Please try again in a moment.",
        action: null,
        data: null
      };
    }
  };

  return { generateResponse };
};
