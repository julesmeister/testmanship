'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, GraduationCap, Award, FileText, Timer } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { ChallengeFormat } from '@/types/challenge-generator';
import { formSchema } from '../schema';

interface ChallengeSettingsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  formats: ChallengeFormat[];
  groupedFormats: Record<string, ChallengeFormat[]>;
  loadFormats: (difficulty: string) => Promise<void>;
  isGenerating: boolean;
  generateSuggestions: () => Promise<void>;
}

export function ChallengeSettings({
  form,
  formats,
  groupedFormats,
  loadFormats,
  isGenerating,
  generateSuggestions
}: ChallengeSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-900 dark:text-white">
          <GraduationCap className="h-5 w-5" />
          Challenge Settings
        </CardTitle>
        <CardDescription className="space-y-2">
          <p>Configure the parameters for your writing challenge:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Award className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
              <span>Select proficiency level (A1-C2)</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
              <span>Choose writing format</span>
            </li>
            <li className="flex items-start gap-2">
              <Timer className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
              <span>Set time allocation</span>
            </li>
          </ul>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h4 className="mb-3 font-medium text-zinc-900 dark:text-white">Proficiency Level</h4>
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Tabs 
                          value={field.value?.toLowerCase() || 'a1'} 
                          onValueChange={(value) => {
                            field.onChange(value.toUpperCase());
                            loadFormats(value.toUpperCase());
                          }}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-6 bg-gray-100 dark:bg-gray-800">
                            <TabsTrigger value="a1" className="data-[state=inactive]:text-gray-600 data-[state=inactive]:dark:text-gray-300">A1</TabsTrigger>
                            <TabsTrigger value="a2" className="data-[state=inactive]:text-gray-600 data-[state=inactive]:dark:text-gray-300">A2</TabsTrigger>
                            <TabsTrigger value="b1" className="data-[state=inactive]:text-gray-600 data-[state=inactive]:dark:text-gray-300">B1</TabsTrigger>
                            <TabsTrigger value="b2" className="data-[state=inactive]:text-gray-600 data-[state=inactive]:dark:text-gray-300">B2</TabsTrigger>
                            <TabsTrigger value="c1" className="data-[state=inactive]:text-gray-600 data-[state=inactive]:dark:text-gray-300">C1</TabsTrigger>
                            <TabsTrigger value="c2" className="data-[state=inactive]:text-gray-600 data-[state=inactive]:dark:text-gray-300">C2</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </FormControl>
                      <FormDescription>
                        From basic (A1) to mastery (C2) level
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="mb-3 font-medium text-zinc-900 dark:text-white">Writing Format</h4>
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        required
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select challenge format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-zinc-900">
                          {Object.entries(groupedFormats).map(([level, levelFormats]) => (
                            <SelectGroup key={level}>
                              <SelectLabel 
                                className="px-2 py-1.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400"
                              >
                                {level} Level Formats
                              </SelectLabel>
                              {levelFormats.map((format) => (
                                <SelectItem 
                                  key={format.id} 
                                  value={format.id}
                                  className="text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                  {format.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="mb-3 font-medium text-zinc-900 dark:text-white">Time Allocation</h4>
                <FormField
                  control={form.control}
                  name="timeAllocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Slider
                              min={1}
                              max={120}
                              step={5}
                              defaultValue={[field.value || 30]}
                              onValueChange={([value]) => field.onChange(value)}
                              className="w-[calc(100%-4rem)]"
                            />
                            <span className="w-14 rounded-md border px-2 py-0.5 text-center text-sm text-zinc-900 dark:text-white">
                              {field.value || 30}m
                            </span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Suggested completion time in minutes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="button"
                variant="secondary"
                onClick={generateSuggestions}
                disabled={isGenerating || !form.getValues('difficulty') || !form.getValues('format')}
                className="w-full transition-all duration-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:shadow-sm"
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Suggestions'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}