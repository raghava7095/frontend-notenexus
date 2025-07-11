import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Flashcard, FlashcardSet } from '@/types/flashcards';

export const useGenerateFlashcards = () => {
  return useMutation({
    mutationFn: async ({ summaryId }: { summaryId: string }) => {
      const { data } = await axios.post<FlashcardSet>(
        '/api/flashcards/generate',
        { summaryId }
      );
      return data;
    },
    onError: (error) => {
      console.error('Error generating flashcards:', error);
      throw error;
    }
  });
};

export const useFlashcardsBySummary = (summaryId: string) => {
  return useQuery({
    queryKey: ['flashcards', summaryId],
    queryFn: async () => {
      const { data } = await axios.get<Flashcard[]>(
        `/api/flashcards/summary/${summaryId}`
      );
      return data;
    },
    enabled: !!summaryId
  });
};

export const useFlashcard = (flashcardId: string) => {
  return useQuery({
    queryKey: ['flashcard', flashcardId],
    queryFn: async () => {
      const { data } = await axios.get<Flashcard>(
        `/api/flashcards/${flashcardId}`
      );
      return data;
    },
    enabled: !!flashcardId
  });
};

export const useDeleteFlashcards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ summaryId }: { summaryId: string }) => {
      const { data } = await axios.delete(
        `/api/flashcards/summary/${summaryId}`
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', variables] });
    },
    onError: (error) => {
      console.error('Error deleting flashcards:', error);
      throw error;
    }
  });
};
