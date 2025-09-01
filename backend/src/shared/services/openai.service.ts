import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

// Type definitions for moderation results
export interface ModerationResult {
  flagged: boolean;
  categories: any; // Use any for OpenAI categories to avoid type conflicts
  category_scores: any; // Use any for OpenAI category scores
  error?: string;
  fallback?: boolean;
  foundKeywords?: string[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, './../../../../.env') });
// Create a single OpenAI instance with proper configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validate that the API key is present
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable is required');
  throw new Error('OpenAI API key is not configured');
}

export { openai };

// Helper functions for common OpenAI operations
export const moderateContent = async (
  content: string
): Promise<ModerationResult> => {
  try {
    console.log(
      '🔍 Starting content moderation for:',
      content?.substring(0, 50) + '...'
    );
    console.log('🔑 API Key present:', !!process.env.OPENAI_API_KEY);
    console.log(
      '🔑 API Key starts with:',
      process.env.OPENAI_API_KEY?.substring(0, 7) + '...'
    );

    if (!content || content.trim() === '') {
      console.log('⚠️ Empty content provided for moderation');
      return {
        flagged: false,
        categories: {},
        category_scores: {},
      };
    }

    const moderation = await openai.moderations.create({
      model: 'text-moderation-latest', // Use the standard model instead
      input: content,
    });

    console.log('✅ Moderation successful:', {
      flagged: moderation.results[0].flagged,
      categories: moderation.results[0].categories,
    });

    return {
      flagged: moderation.results[0].flagged,
      categories: moderation.results[0].categories,
      category_scores: moderation.results[0].category_scores,
    };
  } catch (error: any) {
    console.error('❌ Error moderating content:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      param: error.param,
    });

    // Handle specific error types
    if (error.status === 429) {
      console.log('🚦 Rate limit exceeded - implementing fallback moderation');
      return handleRateLimitFallback(content);
    }

    if (error.status === 401) {
      console.log('🔑 Authentication failed - check API key');
      return {
        flagged: false,
        categories: {},
        category_scores: {},
        error: 'Authentication failed',
      };
    }

    // For other errors, return safe default
    return {
      flagged: false,
      categories: {},
      category_scores: {},
      error: error.message,
    };
  }
};

// Simple fallback moderation when OpenAI is unavailable
const handleRateLimitFallback = (content: string): ModerationResult => {
  console.log('🔄 Using fallback moderation for rate limit');

  // Simple keyword-based moderation as fallback
  const inappropriateKeywords = [
    'puta',
    'trolo',
    'trola',
    'puto',
    'boludo',
    'pelotudo',
    'sorete',
    'cornudo',
    'culo',
    'concha',
    'forro',
    'forra',
    'mierda',
    'huevo',
    'verga',
    // Add more keywords as needed
  ];

  const lowerContent = content.toLowerCase();
  const foundKeywords = inappropriateKeywords.filter((keyword) =>
    lowerContent.includes(keyword)
  );

  const flagged = foundKeywords.length > 0;

  console.log('📝 Fallback moderation result:', {
    flagged,
    foundKeywords,
    reason: 'Rate limit fallback',
  });

  return {
    flagged,
    categories: {
      violence: foundKeywords.some((k) =>
        ['die', 'dies', 'death', 'kill', 'murder'].includes(k)
      ),
      harassment: foundKeywords.some((k) =>
        ['hate', 'stupid', 'idiot', 'moron', 'dumb'].includes(k)
      ),
    },
    category_scores: {},
    fallback: true,
    foundKeywords,
  };
};
