import { useState } from 'react';
import { toast } from 'sonner';
import { ChallengeFormat } from '@/types/challenge-generator';

interface GenerateInstructionsParams {
  title: string;
  difficulty: string;
  format: ChallengeFormat;
  timeAllocation: number;
}

export function useInstructionGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInstructions = async ({
    title,
    difficulty,
    format,
    timeAllocation,
  }: GenerateInstructionsParams) => {
    try {
      setIsGenerating(true);
      toast.loading('Generating instructions...', {
        id: 'generating-instructions',
      });

      console.log('Sending request with:', {
        title,
        difficulty,
        format: format.name,
        timeAllocation
      });

      const response = await fetch('/api/challenge-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          difficulty,
          format: format.name,
          timeAllocation
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate instructions');
      }

      if (!data.suggestions || !data.suggestions.length) {
        throw new Error('No suggestions received');
      }

      const suggestion = data.suggestions[0];
      const formattedInstructions = `${suggestion.description}\n\nKey Points:\n${suggestion.keyPoints.map(point => `• ${point}`).join('\n')}\n• Time Allocation: ${timeAllocation} minutes`;

      toast.success('Instructions generated', {
        id: 'generating-instructions',
        description: 'AI-generated instructions have been added to the form.',
      });

      return formattedInstructions;
    } catch (error) {
      console.error('Error generating instructions:', error);
      toast.error('Failed to generate instructions', {
        id: 'generating-instructions',
        description: error instanceof Error ? error.message : 'Please try again or write your own instructions.',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateInstructions,
  };
}