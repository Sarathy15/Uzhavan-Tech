import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { WeatherData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeCropImage = async (image: File, language: string) => {
  const imagePart = await fileToGenerativePart(image);
  const diseaseSchema = {
    type: Type.OBJECT,
    properties: {
      disease_name: { type: Type.STRING, description: "The common name of the plant disease. If healthy, state 'Healthy'." },
      confidence: { type: Type.NUMBER, description: "A confidence score from 0.0 to 1.0 on the diagnosis." },
      treatment_plan: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Title for the treatment plan." },
          steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of detailed, actionable steps for treatment." },
        },
        required: ["title", "steps"],
      },
      preventive_measures: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Title for preventive measures." },
          steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of preventive measures to avoid future infections." },
        },
        required: ["title", "steps"],
      },
    },
    required: ["disease_name", "confidence", "treatment_plan", "preventive_measures"],
  };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { 
        parts: [
            imagePart,
            { text: `You are an expert agricultural diagnostic system. Analyze this plant leaf image and:
1. Identify any disease or confirm if the plant is healthy
2. Provide a confidence score based on visual symptoms
3. If diseased:
   - Give a detailed, step-by-step treatment plan using locally available methods
   - List preventive measures farmers can take to avoid future infections
4. Consider South Asian farming conditions and common crop varieties
5. Use simple, clear language that farmers can understand

Analyze the image in detail, looking for:
- Leaf coloration and patterns
- Spots, lesions, or discoloration
- Edge conditions and wilting
- Any visible fungal growth or pest damage

Provide your analysis in ${language} language, formatted according to the specified JSON schema.` }
        ]
    },
    config: {
        responseMimeType: 'application/json',
        responseSchema: diseaseSchema,
    }
  });

  return JSON.parse(response.text);
};


export const getWeatherRiskAssessment = async (weatherData: WeatherData[]) => {
  const prompt = `Analyze this 5-day weather forecast from a farmer's perspective:

1. Risk Assessment:
   - Analyze humidity patterns for fungal disease risks
   - Check temperature variations for heat/cold stress
   - Evaluate precipitation for flood/drought risks
   - Consider pest activity likelihood in these conditions

2. Focus Areas:
   - Disease pressure during high humidity periods
   - Optimal timing for spraying/fertilizing
   - Field workability based on precipitation
   - Irrigation needs
   - Harvest timing considerations

3. Provide:
   - Primary risks identified
   - Specific timeframe of risks
   - Clear, actionable recommendations
   - Priority level for each risk

Weather Data:
${JSON.stringify(weatherData, null, 2)}

Format the response as a clear, actionable paragraph focusing on immediate risks and practical steps farmers should take.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
};


export const getChatbotResponse = async (history: { role: string, parts: {text: string}[] }[], message: string) => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are 'Uzhavan Bot', a specialized agricultural AI assistant designed for farmers in South Asia. Your role is to:

1. Provide Expert Agricultural Guidance:
   - Crop management and protection
   - Sustainable farming practices
   - Local pest and disease solutions
   - Weather-based farming decisions
   - Market trends and crop planning

2. Communication Style:
   - Use simple, clear language
   - Avoid technical jargon
   - Give practical, actionable advice
   - Consider local farming conditions
   - Respect traditional farming knowledge
   - Show empathy and understanding

3. Focus Areas:
   - Organic farming methods
   - Water conservation
   - Integrated pest management
   - Soil health management
   - Climate-resilient practices

4. Response Format:
   - Keep answers concise (2-3 paragraphs)
   - Prioritize actionable advice
   - Include local context
   - Suggest affordable solutions
   - Reference traditional methods when applicable

Always maintain a helpful, encouraging tone while providing accurate, practical agricultural information.`,
        },
        history,
    });
    const response = await chat.sendMessage({ message });
    return response.text;
};