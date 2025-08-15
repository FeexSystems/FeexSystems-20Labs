/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Team Collaboration Types
export enum TeamRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER'
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED'
}

export enum ResourceType {
  AI_REQUEST = 'AI_REQUEST',
  REPOSITORY = 'REPOSITORY',
  PIPELINE = 'PIPELINE',
  DEPLOYMENT = 'DEPLOYMENT',
  SECURITY_SCAN = 'SECURITY_SCAN',
  WORKSPACE = 'WORKSPACE'
}

// Team interfaces
export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  settings?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  members?: TeamMember[];
  workspaces?: Workspace[];
  memberCount?: number;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  permissions?: Record<string, any>;
  status: MemberStatus;
  joinedAt: Date;
  invitedBy?: string;
  lastActiveAt?: Date;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: TeamRole;
  permissions?: Record<string, any>;
  status: InvitationStatus;
  token: string;
  invitedBy: string;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
  team?: {
    id: string;
    name: string;
  };
}

export interface Workspace {
  id: string;
  teamId: string;
  name: string;
  description?: string;
  settings?: Record<string, any>;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  resourceCount?: number;
}

export interface ResourceShare {
  id: string;
  teamId: string;
  workspaceId?: string;
  resourceType: ResourceType;
  resourceId: string;
  permissions: Record<string, any>;
  sharedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamActivityLog {
  id: string;
  teamId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Request/Response types for API endpoints
export interface CreateTeamRequest {
  name: string;
  description?: string;
  settings?: Record<string, any>;
}

export interface CreateTeamResponse {
  team: Team;
  success: boolean;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  settings?: Record<string, any>;
}

export interface UpdateTeamResponse {
  team: Team;
  success: boolean;
}

export interface InviteTeamMemberRequest {
  email: string;
  role: TeamRole;
  permissions?: Record<string, any>;
}

export interface InviteTeamMemberResponse {
  invitation: TeamInvitation;
  success: boolean;
}

export interface AcceptInvitationRequest {
  token: string;
}

export interface AcceptInvitationResponse {
  teamMember: TeamMember;
  team: Team;
  success: boolean;
}

export interface UpdateMemberRoleRequest {
  role: TeamRole;
  permissions?: Record<string, any>;
}

export interface UpdateMemberRoleResponse {
  member: TeamMember;
  success: boolean;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  settings?: Record<string, any>;
}

export interface CreateWorkspaceResponse {
  workspace: Workspace;
  success: boolean;
}

export interface ShareResourceRequest {
  workspaceId?: string;
  resourceType: ResourceType;
  resourceId: string;
  permissions: Record<string, any>;
}

export interface ShareResourceResponse {
  resourceShare: ResourceShare;
  success: boolean;
}

export interface TeamActivityResponse {
  activities: TeamActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
}

// Permission definitions
export interface TeamPermissions {
  canManageTeam: boolean;
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
  canManageWorkspaces: boolean;
  canShareResources: boolean;
  canViewActivity: boolean;
  canManageSettings: boolean;
}

export interface ResourcePermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canExecute?: boolean; // For pipelines, scans, etc.
}

// Utility functions for permissions
export const getTeamPermissions = (role: TeamRole): TeamPermissions => {
  switch (role) {
    case TeamRole.OWNER:
      return {
        canManageTeam: true,
        canInviteMembers: true,
        canRemoveMembers: true,
        canManageWorkspaces: true,
        canShareResources: true,
        canViewActivity: true,
        canManageSettings: true
      };
    case TeamRole.ADMIN:
      return {
        canManageTeam: false,
        canInviteMembers: true,
        canRemoveMembers: true,
        canManageWorkspaces: true,
        canShareResources: true,
        canViewActivity: true,
        canManageSettings: false
      };
    case TeamRole.MEMBER:
      return {
        canManageTeam: false,
        canInviteMembers: false,
        canRemoveMembers: false,
        canManageWorkspaces: false,
        canShareResources: true,
        canViewActivity: true,
        canManageSettings: false
      };
    case TeamRole.VIEWER:
      return {
        canManageTeam: false,
        canInviteMembers: false,
        canRemoveMembers: false,
        canManageWorkspaces: false,
        canShareResources: false,
        canViewActivity: true,
        canManageSettings: false
      };
    default:
      return {
        canManageTeam: false,
        canInviteMembers: false,
        canRemoveMembers: false,
        canManageWorkspaces: false,
        canShareResources: false,
        canViewActivity: false,
        canManageSettings: false
      };
  }
};

export const getDefaultResourcePermissions = (role: TeamRole): ResourcePermissions => {
  switch (role) {
    case TeamRole.OWNER:
    case TeamRole.ADMIN:
      return {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canExecute: true
      };
    case TeamRole.MEMBER:
      return {
        canView: true,
        canEdit: true,
        canDelete: false,
        canShare: true,
        canExecute: true
      };
    case TeamRole.VIEWER:
      return {
        canView: true,
        canEdit: false,
        canDelete: false,
        canShare: false,
        canExecute: false
      };
    default:
      return {
        canView: false,
        canEdit: false,
        canDelete: false,
        canShare: false,
        canExecute: false
      };
  }
};
