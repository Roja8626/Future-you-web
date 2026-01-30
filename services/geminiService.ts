import { GoogleGenAI } from "@google/genai";
import { UserProfile, LanguageCode } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getLanguageInstruction = (lang: LanguageCode): string => {
  switch (lang) {
    case 'ta':
      return "Write in Tamil (Tamil Script). Tone: Soft, poetic, caring, like a wise elder or inner conscience.";
    case 'tgl':
      return `
        Write in Tanglish (Tamil spoken in English script). 
        CRITICAL STYLE RULES:
        - Use Roman alphabet only.
        - Tone: Informal, intimate, like a best friend or your own inner voice.
        - Use natural conversational fillers like 'paa', 'dhan', 'machan' (if appropriate context), 'kanna'.
        - Do NOT simply translate English formal sentences. Use spoken grammar.
        - Example: Instead of "Do not worry", say "Kavalai padadhe" or "Feel pannadhe".
        - Avoid very formal Tamil words. Use words like 'life', 'trust', 'courage' in English if that's how people speak, but mix it naturally with Tamil syntax.
      `;
    case 'hi':
      return "Write in Hindi. Tone: Warm, reassuring, 'apnapan' (sense of belonging). Avoid overly Sanskritized formal Hindi. Use Hindustani/conversational style.";
    case 'es':
      return "Write in Spanish. Tone: 'Cercano' (close), warm, gentle. Use 'tú' not 'usted'.";
    case 'ar':
      return "Write in Arabic. Tone: Poetic but accessible, warm, reassuring.";
    default:
      return `Write in ${lang === 'en' ? 'English' : 'the user\'s selected language'}. Tone: Compassionate, calm, anchored.`;
  }
};

export const generateFutureSelfLetter = async (user: UserProfile): Promise<string> => {
  const model = "gemini-3-flash-preview";

  const langInstruction = getLanguageInstruction(user.language);

  const systemInstruction = `
    You are the "Future Self" of the user. 
    The user is currently creating a connection with you to find emotional grounding.
    
    User Profile:
    - Name: "${user.name}"
    - Time Horizon: "${user.timeHorizon}"
    - How they visualize you: "${user.futureDescription}"
    - What they need from you right now (Emotional Focus): "${user.emotionalFocus}"
    
    Language Requirement:
    ${langInstruction}

    Your Tone:
    - Compassionate, calm, and anchored.
    - Clear and strong, but gentle.
    - Intimate and personal, using "I" (as the future self) and "You".
    - Brevity is key. Keep it under 150 words.
    - NO hustle culture advice. NO "work harder".
    
    Goal:
    - Acknowledge their current state.
    - Validate their potential to become you.
    - Specifically address their need for "${user.emotionalFocus}".
    - Offer a specific thought of reassurance based on the description they provided.
    - End with a short, anchoring phrase.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: "Write me a letter to help me trust myself today.",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I am here with you, always.";
  } catch (error) {
    console.error("Error generating letter:", error);
    return `Dear ${user.name}, I am here. Breathe.`;
  }
};

export const generateDailyPrompt = async (user: UserProfile, previousReflection?: string): Promise<string> => {
  const model = "gemini-3-flash-preview";
  const langInstruction = getLanguageInstruction(user.language);

  const prompt = `
    Generate a single, short (1 sentence) daily reflection question for the user.
    The goal is to help them align with their "Future Self".
    Focus: ${user.emotionalFocus}
    
    Language Requirement:
    ${langInstruction}
    
    Do not repeat generic questions.
    Make it specific to emotional state or mindset.
    It should feel like a gentle invitation, not a task.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "What is one small kindness you can offer yourself today?";
  } catch (error) {
    console.error("Error generating prompt:", error);
    return "What does your inner voice want to say?";
  }
};

export const generateResponseLetter = async (
  user: UserProfile,
  userReflection: string,
  originalPrompt: string
): Promise<string> => {
  const model = "gemini-3-flash-preview";
  const langInstruction = getLanguageInstruction(user.language);

  const systemInstruction = `
    You are the user's "Future Self" responding to their reflection.
    
    User Profile:
    - Name: "${user.name}"
    - What they need (Emotional Focus): "${user.emotionalFocus}"
    
    The user was asked: "${originalPrompt}"
    They responded: "${userReflection}"
    
    Language Requirement:
    ${langInstruction}
    
    Your Task:
    - Write a short, heartfelt motivational response (under 120 words).
    - Acknowledge what they shared.
    - Provide encouragement and validation.
    - Remind them of their strength and capability.
    - End with a warm, empowering closing thought.
    
    Tone:
    - Compassionate, warm, and uplifting.
    - Like a caring mentor or future version of themselves.
    - NO toxic positivity. Be genuine and grounded.
    - Personal and intimate, using "you" directly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: "Generate a motivational response letter.",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "You showed up today. That takes courage. I'm proud of you.";
  } catch (error) {
    console.error("Error generating response letter:", error);
    return `Dear ${user.name},\n\nThank you for showing up today. What you shared matters, and the fact that you're reflecting shows incredible strength.\n\nKeep going. I believe in you.`;
  }
};