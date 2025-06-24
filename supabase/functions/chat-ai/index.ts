
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();

    const systemPrompt = `You are Fokus.ai, a conversational productivity companion. Your role is to help users organize their day by understanding their needs and extracting actionable items.

Key behaviors:
1. Extract tasks from user messages (look for "need to", "have to", "should", "remind me", etc.)
2. Extract calendar events (look for meetings, calls, appointments, time mentions)
3. Be supportive and understanding of different religious and cultural backgrounds
4. Provide helpful responses that acknowledge what you've captured

When you identify tasks or events, respond in this JSON format:
{
  "message": "Your conversational response to the user",
  "action": "create_task" | "create_event" | "setup_profile" | null,
  "data": {
    "title": "extracted title",
    "priority": "high" | "medium" | "low",
    "time": "extracted time if applicable",
    "category": "work" | "personal" | "spiritual" | "health"
  }
}

For general conversations without clear actions, just respond with:
{
  "message": "Your supportive response",
  "action": null,
  "data": null
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...context.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          })),
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse;
    
    try {
      // Try to parse as JSON first
      aiResponse = JSON.parse(data.choices[0].message.content);
    } catch {
      // If not JSON, treat as plain text
      aiResponse = {
        message: data.choices[0].message.content,
        action: null,
        data: null
      };
    }

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(JSON.stringify({ 
      message: "I'm having trouble processing your request right now. Please try again.",
      action: null,
      data: null,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
