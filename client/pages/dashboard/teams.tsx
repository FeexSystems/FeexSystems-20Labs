import React, { useState, useEffect } from 'react';
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Plus, 
  UserPlus, 
  Crown, 
  Shield, 
  User,
  Eye,
  FolderPlus,
  MoreHorizontal
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { TeamActivityFeed } from "@/components/realtime/TeamActivityFeed";

interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  members: TeamMember[];
  workspaces: Workspace[];
  _count: {
    members: number;
    workspaces: number;
  };
}

interface TeamMember {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  joinedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeamsPage() {
  const { user } = useAuthStore();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [inviteMemberOpen, setInviteMemberOpen] = useState<string | null>(null);
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState<string | null>(null);

  // Form states
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [newMember, setNewMember] = useState({ email: '', role: 'MEMBER' as const });
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'Development Team',
          description: 'Core development team for the main application',
          createdAt: '2024-01-15T10:00:00Z',
          members: [
            {
              id: '1',
              role: 'OWNER',
              joinedAt: '2024-01-15T10:00:00Z',
              user: {
                id: user?.id || '1',
                email: user?.email || 'user@example.com',
                firstName: user?.firstName || 'John',
                lastName: user?.lastName || 'Doe',
                profileImageUrl: user?.profileImageUrl
              }
            }
          ],
          workspaces: [],
          _count: {
            members: 1,
            workspaces: 0
          }
        }
      ];
      
      setTeams(mockTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading teams...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teams & Workspaces</h1>
            <p className="text-muted-foreground">
              Manage your teams, invite members, and organize workspaces.
            </p>
          </div>
          <Button onClick={() => setCreateTeamOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        </div>

        {/* Teams Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  {team.name}
                </CardTitle>
                <CardDescription>
                  {team.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm mb-4">
                  <span>{team._count.members} members</span>
                  <span>{team._count.workspaces} workspaces</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {teams.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No teams yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first team to start collaborating with colleagues.
              </p>
              <Button onClick={() => setCreateTeamOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Team
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Team Activity Feed */}
        {teams.length > 0 && (
          <div className="mt-8">
            <TeamActivityFeed
              title="Recent Team Activity"
              maxHeight="h-80"
              showFilters={true}
              limit={20}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 