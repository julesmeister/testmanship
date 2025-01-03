"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Clock, Star, Users } from 'lucide-react';
import DashboardLayout from '@/components/layout';
import { formatDistanceToNow } from 'date-fns';
import cn from 'classnames';
import { WordsmithProps } from '@/types/wordsmith';
import { useWordsmithUsers } from '@/hooks/useWordsmithUsers';
import { useUserChallenges } from '@/hooks/useUserChallenges';
import { UserChallengesDialog } from './UserChallengesDialog';
import { StatsCard } from '@/components/card/StatsCard';

export default function Wordsmiths({ user, userDetails }: WordsmithProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { users, isLoading, searchQuery, setSearchQuery, stats } = useWordsmithUsers();
  const { userChallenges, userProgress, isLoading: isLoadingChallenges } = useUserChallenges(selectedUser);

  const handleUserClick = (userId: string) => {
    setSelectedUser(userId === selectedUser ? null : userId);
  };

  const selectedUserData = users.find(user => user.id === selectedUser);

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const content = (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Wordsmiths</h2>
        <p className="text-muted-foreground">
          Browse and discover fellow language learners in the community.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          icon={<Users className="h-5 w-5" />}
          iconBgColor="bg-blue-500/10"
          iconTextColor="text-blue-500"
          title="Total Wordsmiths"
          value={stats.totalUsers}
          subtitle="registered users"
        />

        <StatsCard
          icon={<Star className="h-5 w-5" />}
          iconBgColor="bg-amber-500/10"
          iconTextColor="text-amber-500"
          title="Total Credits"
          value={stats.totalCredits}
          subtitle="earned credits"
        />

        <StatsCard
          icon={<Clock className="h-5 w-5" />}
          iconBgColor="bg-green-500/10"
          iconTextColor="text-green-500"
          title="Active Users"
          value={stats.activeThisWeek}
          subtitle="this week"
        />
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 px-2 sm:px-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search Wordsmiths by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filteredUsers.map((user) => (
            <Card 
              key={user.id} 
              className={cn(
                "group overflow-hidden transition-colors hover:border-primary cursor-pointer",
                selectedUser === user.id && "border-primary bg-primary/5"
              )}
              onClick={() => handleUserClick(user.id)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-background">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-base sm:text-lg">
                      {user.full_name.split(' ').map(n => n[0]).join('') || '?' }
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1.5 sm:space-y-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-1">{user.full_name || 'Anonymous'}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Last active {formatDistanceToNow(new Date(user.updated_at))} ago
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {user.target_language && (
                        <Badge variant="secondary" className="group-hover:bg-primary/10 text-xs sm:text-sm">
                          Learning: {user.target_language.name}
                        </Badge>
                      )}
                      {user.native_language && (
                        <Badge variant="outline" className="group-hover:border-primary/30 text-xs sm:text-sm">
                          Native: {user.native_language.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-6 flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                  <div>
                    <Label className="font-normal text-muted-foreground">Credits</Label>
                    <p className="mt-0.5 sm:mt-1 text-lg sm:text-xl font-semibold text-foreground">{user.credits}</p>
                  </div>
                  <div>
                    <Label className="font-normal text-muted-foreground">Trial Credits</Label>
                    <p className="mt-0.5 sm:mt-1 text-lg sm:text-xl font-semibold text-foreground">{user.trial_credits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 text-center mx-2 sm:mx-0">
          <div className="relative">
            <Users className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground/20" />
          </div>
          <h3 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-semibold text-foreground">No Wordsmiths Found</h3>
          {searchQuery ? (
            <>
              <p className="mt-2 sm:mt-3 max-w-[500px] text-sm sm:text-base text-muted-foreground">
                No users match your search criteria. Try adjusting your search terms or clearing the search to see all Wordsmiths.
              </p>
              <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm [&_svg]:mx-auto [&_svg]:mb-2">
                <div className="space-y-1 text-muted-foreground">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  <p className="font-medium">Search Tips</p>
                  <p className="text-xs">Try searching by name, native language, or target language</p>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  <p className="font-medium">About Wordsmiths</p>
                  <p className="text-xs">Connect with language learners who share your learning goals</p>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                  <p className="font-medium">Why Connect?</p>
                  <p className="text-xs">Exchange language knowledge and earn credits through helping others</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 sm:mt-3 max-w-[500px] text-sm sm:text-base text-muted-foreground">
                Wordsmiths are passionate language learners in our community. They earn credits by helping others learn their native language
                and spend them to receive help with their target language.
              </p>
              <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm [&_svg]:mx-auto [&_svg]:mb-2">
                <div className="space-y-1 text-muted-foreground">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                  <p>Earn credits by helping others</p>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                  <p>Track learning progress</p>
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      {/* User Challenges Dialog */}
      <UserChallengesDialog
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        userProgress={userProgress}
        userChallenges={userChallenges}
        isLoading={isLoadingChallenges}
        userName={selectedUserData?.full_name || ''}
      />
    </div>
  );

  return (
    <DashboardLayout
      user={user}
      userDetails={userDetails}
      title="Wordsmiths"
      description="Discover and connect with fellow language learners in our community."
    >
      {content}
    </DashboardLayout>
  );
}
