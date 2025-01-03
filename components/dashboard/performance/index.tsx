'use client';

import { User } from '@supabase/supabase-js';
import DashboardLayout from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Trophy, PenTool, Clock, Target, Loader2, BarChart3 } from 'lucide-react';
import cn from 'classnames';
import { PerformanceOverview } from "@/components/dashboard/performance/components/PerformanceOverview";
import { PerformanceLoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { PerformanceAnalysis } from './components/PerformanceAreasForImprovement';
import WordsPerChallengeGraph from './components/WordsPerChallengeGraph';
import { useUserWordStats } from '@/hooks/useUserWordStats';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

interface UserProgress {
  total_challenges_completed: number;
  total_words_written: number;
  total_time_spent: number;
  average_performance: number;
  weakest_skills: string[];
  last_active_level: string;
  longest_streak: number;
}

interface SkillMetric {
  category: string;
  skill_name: string;
  proficiency_level: number;
  improvement_rate: number;
}

interface PerformanceTrend {
  week: string;
  avg_score: number;
  avg_words: number;
  avg_time: number;
  challenges_completed: number;
}

interface WordCountTimeSeries {
  word_count: number;
  completed_at: string;
}

export default function Performance({ user, userDetails }: Props) {
  const supabase = createClientComponentClient();
  const { progress, wordCountData, isLoading, error } = useUserWordStats(supabase, user);
  const [skillMetrics, setSkillMetrics] = useState<SkillMetric[]>([
    {
      category: 'Writing',
      skill_name: 'Grammar & Structure',
      proficiency_level: 7.5,
      improvement_rate: 12
    },
    {
      category: 'Content',
      skill_name: 'Research & Analysis',
      proficiency_level: 6.8,
      improvement_rate: 8
    },
    {
      category: 'Style',
      skill_name: 'Clarity & Conciseness',
      proficiency_level: 8.2,
      improvement_rate: 15
    },
    {
      category: 'Technical',
      skill_name: 'Documentation',
      proficiency_level: 6.5,
      improvement_rate: 5
    }
  ]);

  const [trends, setTrends] = useState<PerformanceTrend[]>([
    
  ]);

  useEffect(() => {
    async function fetchSkillMetrics() {
      if (!user) return;

      try {
        // Fetch skill metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from('skill_metrics')
          .select('*')
          .eq('user_id', user.id);

        if (metricsData && !metricsError && metricsData.length > 0) {
          setSkillMetrics(metricsData);
        }
      } catch (error) {
        console.error('Error fetching skill metrics:', error);
      }
    }

    fetchSkillMetrics();
  }, [user, supabase]);

  useEffect(() => {
    async function fetchPerformanceTrends() {
      if (!user) return;

      try {
        // Fetch performance trends
        const { data: trendsData, error: trendsError } = await supabase
          .from('user_performance_trends')
          .select('*')
          .eq('user_id', user.id)
          .order('week', { ascending: false })
          .limit(8);

        if (trendsData && !trendsError && trendsData.length > 0) {
          setTrends(trendsData);
        }
      } catch (error) {
        console.error('Error fetching performance trends:', error);
      }
    }

    fetchPerformanceTrends();
  }, [user, supabase]);

  return (
    <DashboardLayout
      user={user}
      userDetails={userDetails}
      title="Performance Analytics"
      description="Track your writing progress and skill development"
    >
      {error ? (
        <ErrorState error={error} />
      ) : isLoading ? (
        <PerformanceLoadingState />
      ) : (
        <div className="min-h-screen w-full space-y-6">
          {progress && <PerformanceOverview progress={progress} />}
          <WordsPerChallengeGraph 
            data={wordCountData.map(item => ({
              challenge_number: new Date(item.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              words_written: item.word_count
            }))}
          />
          {/* Skills and Progress */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Skill Metrics */}
            <Card>
              <CardHeader className="border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                  </div>
                  <CardTitle className="text-foreground">Skill Progress</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {skillMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none text-foreground">
                            {metric.skill_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {metric.category}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge key={index} variant="secondary" className="font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                            {metric.proficiency_level.toFixed(1)}
                          </Badge>
                          {metric.improvement_rate > 0 && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                              +{metric.improvement_rate}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Progress 
                        value={metric.proficiency_level * 10} 
                        className={`bg-gray-100 ${
                          metric.proficiency_level < 5 
                            ? '[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-600'
                            : metric.proficiency_level < 7
                            ? '[&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-yellow-600'
                            : '[&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-green-600'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <PerformanceAnalysis weakest_skills={progress?.weakest_skills ?? []} />
          </div>

          {/* Performance Trends */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-foreground">Weekly Performance</CardTitle>
              <CardDescription className="text-muted-foreground">
                Your writing progress over the past weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trends.map((trend, index) => {
                  const isLatest = index === 0;
                  return (
                    <div key={index} className="min-w-[250px]">
                      <div className={cn(
                        "rounded-xl border bg-card text-card-foreground shadow transition-all hover:bg-accent p-4"
                      )}>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                Week of {format(new Date(trend.week), 'MMM d, yyyy')}
                              </p>
                              {isLatest && (
                                <p className="text-xs text-muted-foreground mt-1">Latest</p>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <div className="p-1.5 rounded-md bg-primary/10">
                                <Target className="text-primary h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {trend.challenges_completed}
                                </p>
                                <p className="text-xs text-muted-foreground">Challenges</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="p-1.5 rounded-md bg-blue-50">
                                <PenTool className="text-blue-500 h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {Math.round(trend.avg_words).toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">Words/Challenge</p>
                              </div>
                            </div>
                            {(isLatest || !isLatest) && (
                              <div className="flex items-center space-x-2">
                                <div className="p-1.5 rounded-md bg-green-50">
                                  <Clock className="text-green-500 h-4 w-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {Math.round(trend.avg_time)}min
                                  </p>
                                  <p className="text-xs text-muted-foreground">Avg. Time</p>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            <span className="text-xs text-muted-foreground">Score:</span>
                            <Progress 
                              value={trend.avg_score * 10} 
                              className={cn(
                                "bg-gray-100",
                                trend.avg_score < 5 
                                  ? '[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-600'
                                  : trend.avg_score < 7
                                  ? '[&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-yellow-600'
                                  : '[&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-green-600'
                              )} 
                            />
                            <span className="text-sm font-medium text-foreground">
                              {trend.avg_score.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
