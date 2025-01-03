import { 
  HiMagnifyingGlass,
  HiChartBar,
  HiCog,
  HiClipboardDocument,
  HiArrowPath
} from 'react-icons/hi2';

interface EvaluationLoadingProps {
  onRefresh: () => void;
  isTimeUp: boolean;
}

export const EvaluationLoading = ({ onRefresh, isTimeUp }: EvaluationLoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4 p-4">
      {/* Loading Text */}
      <div className="justify-center mt-6 space-y-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Our AI is carefully reviewing your submission...</span>
          </div>
          {isTimeUp && (
            <button
              onClick={onRefresh}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              <HiArrowPath className="h-4 w-4" />
              <span>Reevaluate</span>
            </button>
          )}
        </div>
        <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl animate-pulse">
          <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg flex items-center justify-center">
                <HiMagnifyingGlass className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium">Analyzing your writing patterns, sentence structures, and language usage to provide comprehensive feedback on your writing skills and proficiency level...</p>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg flex items-center justify-center">
                <HiChartBar className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium">Evaluating grammar accuracy, vocabulary diversity, coherence between paragraphs, and overall writing fluency to generate detailed insights about your language abilities...</p>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg flex items-center justify-center">
                <HiCog className="h-8 w-8 text-primary animate-spin" />
              </div>
              <p className="font-medium">Processing linguistic metrics, identifying key strengths and potential areas for improvement, while preparing personalized recommendations for your language learning journey...</p>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg flex items-center justify-center">
                <HiClipboardDocument className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium">Generating detailed performance analysis and actionable suggestions to help you develop more effective writing strategies and improve your language proficiency...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
