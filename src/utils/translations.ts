import { TRANSLATOR_CONFIG } from './translationConfig';
import type { TranslationResponse } from '../types/translation';

export async function translateText(text: string, targetLang: string = 'es'): Promise<string> {
  if (!text?.trim()) {
    return '';
  }

  try {
    const response = await fetch(`${TRANSLATOR_CONFIG.ENDPOINT}?key=${TRANSLATOR_CONFIG.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang
      }),
    });

    if (!response.ok) {
      console.error('Response status:', response.status);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Translation response:', data);

    if (data.data?.translations?.[0]?.translatedText) {
      return data.data.translations[0].translatedText;
    } else {
      console.error('Unexpected response format:', data);
      return text;
    }

  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Translation failed. Please try again.');
  }
}