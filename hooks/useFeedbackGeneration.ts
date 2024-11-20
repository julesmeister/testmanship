import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface Challenge {
  id: string;
  title: string;
  instructions: string;
  difficulty_level: string;
  time_allocation: number;
  word_count?: number;
  grammar_focus?: string[];
  vocabulary_themes?: string[];
}

export const useFeedbackGeneration = (
  challenge: Challenge | null,
  onGenerateFeedback: (paragraph: string) => Promise<string>,
  setFeedback: (feedback: string) => void,
) => {
  const [lastFeedbackTime, setLastFeedbackTime] = useState<number>(0);
  const MIN_FEEDBACK_INTERVAL = 5000; // 5 seconds

  const validateFeedbackRequest = useCallback((inputMessage?: string) => {
    if (!challenge) throw new Error('No active challenge found');
    if (!inputMessage?.trim()) throw new Error('No text to analyze');
    return true;
  }, [challenge]);

  const handleGenerateFeedback = useCallback(async (paragraph: string): Promise<string> => {
    validateFeedbackRequest(paragraph);
    
    const now = Date.now();
    const timeSinceLastFeedback = now - lastFeedbackTime;
    
    if (timeSinceLastFeedback < MIN_FEEDBACK_INTERVAL) {
      const waitTime = Math.ceil((MIN_FEEDBACK_INTERVAL - timeSinceLastFeedback) / 1000);
      throw new Error(`rate limit exceeded. Please wait ${waitTime} seconds.`);
    }

    try {
      const result = await onGenerateFeedback(paragraph);
      setLastFeedbackTime(now);
      return result;
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes('rate limit')) {
        throw new Error(`rate limit exceeded. Please wait a moment.`);
      }
      throw error;
    }
  }, [challenge, lastFeedbackTime, onGenerateFeedback, validateFeedbackRequest]);

  const handleParagraphFeedback = useCallback(async (paragraph: string, index: number) => {
    if (!paragraph?.trim()) {
      toast.error('No text to analyze in this paragraph');
      return;
    }

    const toastId = toast.loading(`Analyzing paragraph ${index + 1}...`);
    try {
      const feedback = await handleGenerateFeedback(paragraph);
      if (!feedback?.trim()) {
        toast.dismiss(toastId);
        toast.error('No feedback received');
        return;
      }
      setFeedback(feedback);
      toast.dismiss(toastId);
      toast.success(`Generated feedback for paragraph ${index + 1}`);
    } catch (error) {
      // Always dismiss the loading toast first
      toast.dismiss(toastId);
      
      let errorMessage = 'Failed to generate feedback';
      let duration = 3000; // default 3 seconds
      
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          errorMessage = error.message;
          duration = 5000; // show rate limit errors longer
        } else {
          errorMessage = error.message;
        }
      }
      
      // Show error toast
      toast.error(errorMessage, { duration });

      // Log error details in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Feedback generation error:', error);
      }
    }
  }, [handleGenerateFeedback, setFeedback]);

  const handleFinishChallenge = useCallback(async (inputMessage: string, onStopChallenge: () => void) => {
    try {
      validateFeedbackRequest(inputMessage);
      
      const toastId = toast.loading('Analyzing your complete essay...');
      
      const feedback = await handleGenerateFeedback(inputMessage);
      
      if (feedback?.trim()) {
        setFeedback(feedback);
        toast.dismiss(toastId);
        toast.success('Generated comprehensive feedback');
      } else {
        toast.dismiss(toastId);
        toast.error('No feedback received');
      }
      
      onStopChallenge();
    } catch (error) {
      let errorMessage = 'Failed to generate feedback';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      console.warn('Challenge completion error:', error);
    }
  }, [handleGenerateFeedback, setFeedback]);

  // Clear feedback content when challenge changes
  useEffect(() => {
    setFeedback('');
  }, [challenge, setFeedback]);

  return {
    handleParagraphFeedback,
    handleFinishChallenge,
  };
};
