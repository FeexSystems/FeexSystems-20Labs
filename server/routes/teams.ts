import express from 'express';
import { z } from 'zod';
import { authMiddleware } from '../lib/middleware/auth.middleware';
import { rateLimitMiddleware } from '../lib/middleware/rate-limit.middleware';
import { PrismaClient } from '@prisma/client';
import { createActivityLog } from '../lib/services/activity-log.service';

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication to all team routes
router.use(authMiddleware);

// Validation schemas
const createTeamSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

const updateTeamSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
});

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']).default('MEMBER'),
});

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

/**
 * POST /api/teams
 * Create a new team
 */
router.post('/', 
  rateLimitMiddleware({ windowMs: 60 * 1000, max: 10 }),
  async (req, res) => {
    try {
      const validation = createTeamSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: validation.error.errors
        });
      }

      const { name, description } = validation.data;
      const userId = req.user!.id;

      // Create team and add creator as owner
      const team = await prisma.team.create({
        data: {
          name,
          description,
          members: {
            create: {
              userId,
              role: 'OWNER'
            }
          }
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  profileImageUrl: true
                }
              }
            }
          }
        }
      });

      // Log activity
      await createActivityLog({
        userId,
        action: 'CREATE',
        resource: 'TEAM',
        resourceId: team.id,
        metadata: { teamName: name }
      });

      res.status(201).json({
        success: true,
        data: team
      });
    } catch (error) {
      console.error('Error creating team:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create team'
      });
    }
  }
);

/**
 * GET /api/teams
 * Get user's teams
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user!.id;

    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true
              }
            }
          }
        },
        workspaces: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        _count: {
          select: {
            members: true,
            workspaces: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch teams'
    });
  }
});

/**
 * GET /api/teams/:id
 * Get team details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if user is member of the team
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: id,
          userId
        }
      }
    });

    if (!teamMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You are not a member of this team.'
      });
    }

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true
              }
            }
          }
        },
        workspaces: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch team'
    });
  }
});

/**
 * PUT /api/teams/:id
 * Update team details
 */
router.put('/:id', 
  rateLimitMiddleware({ windowMs: 60 * 1000, max: 10 }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const validation = updateTeamSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: validation.error.errors
        });
      }

      // Check if user is admin or owner of the team
      const teamMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: id,
            userId
          }
        }
      });

      if (!teamMember || !['OWNER', 'ADMIN'].includes(teamMember.role)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Only team admins and owners can update team details.'
        });
      }

      const { name, description } = validation.data;
      
      const updatedTeam = await prisma.team.update({
        where: { id },
        data: {
          name,
          description
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  profileImageUrl: true
                }
              }
            }
          }
        }
      });

      // Log activity
      await createActivityLog({
        userId,
        action: 'UPDATE',
        resource: 'TEAM',
        resourceId: id,
        metadata: { teamName: updatedTeam.name }
      });

      res.json({
        success: true,
        data: updatedTeam
      });
    } catch (error) {
      console.error('Error updating team:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update team'
      });
    }
  }
);

/**
 * POST /api/teams/:id/invite
 * Invite a member to the team
 */
router.post('/:id/invite',
  rateLimitMiddleware({ windowMs: 60 * 1000, max: 20 }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const validation = inviteMemberSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: validation.error.errors
        });
      }

      // Check if user is admin or owner of the team
      const teamMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: id,
            userId
          }
        }
      });

      if (!teamMember || !['OWNER', 'ADMIN'].includes(teamMember.role)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Only team admins and owners can invite members.'
        });
      }

      const { email, role } = validation.data;

      // Find user by email
      const invitedUser = await prisma.user.findUnique({
        where: { email }
      });

      if (!invitedUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found with this email address'
        });
      }

      // Check if user is already a member
      const existingMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: id,
            userId: invitedUser.id
          }
        }
      });

      if (existingMember) {
        return res.status(400).json({
          success: false,
          error: 'User is already a member of this team'
        });
      }

      // Add user to team
      const newMember = await prisma.teamMember.create({
        data: {
          teamId: id,
          userId: invitedUser.id,
          role
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true
            }
          }
        }
      });

      // Log activity
      await createActivityLog({
        userId,
        action: 'INVITE',
        resource: 'TEAM_MEMBER',
        resourceId: newMember.id,
        metadata: { 
          teamId: id, 
          invitedUserEmail: email,
          role 
        }
      });

      res.status(201).json({
        success: true,
        data: newMember,
        message: 'Member invited successfully'
      });
    } catch (error) {
      console.error('Error inviting member:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to invite member'
      });
    }
  }
);

/**
 * DELETE /api/teams/:id/members/:memberId
 * Remove a member from the team
 */
router.delete('/:id/members/:memberId',
  rateLimitMiddleware({ windowMs: 60 * 1000, max: 10 }),
  async (req, res) => {
    try {
      const { id: teamId, memberId } = req.params;
      const userId = req.user!.id;

      // Check if user is admin or owner of the team
      const teamMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId
          }
        }
      });

      if (!teamMember || !['OWNER', 'ADMIN'].includes(teamMember.role)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Only team admins and owners can remove members.'
        });
      }

      // Check if trying to remove the last owner
      if (memberId === userId) {
        const ownerCount = await prisma.teamMember.count({
          where: {
            teamId,
            role: 'OWNER'
          }
        });

        if (ownerCount === 1) {
          return res.status(400).json({
            success: false,
            error: 'Cannot remove the last owner from the team'
          });
        }
      }

      // Remove member
      await prisma.teamMember.delete({
        where: {
          teamId_userId: {
            teamId,
            userId: memberId
          }
        }
      });

      // Log activity
      await createActivityLog({
        userId,
        action: 'REMOVE',
        resource: 'TEAM_MEMBER',
        resourceId: memberId,
        metadata: { teamId }
      });

      res.json({
        success: true,
        message: 'Member removed successfully'
      });
    } catch (error) {
      console.error('Error removing member:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove member'
      });
    }
  }
);

/**
 * POST /api/teams/:id/workspaces
 * Create a new workspace in the team
 */
router.post('/:id/workspaces',
  rateLimitMiddleware({ windowMs: 60 * 1000, max: 10 }),
  async (req, res) => {
    try {
      const { id: teamId } = req.params;
      const userId = req.user!.id;
      const validation = createWorkspaceSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: validation.error.errors
        });
      }

      // Check if user is member of the team
      const teamMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId
          }
        }
      });

      if (!teamMember) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You are not a member of this team.'
        });
      }

      const { name, description, settings } = validation.data;

      const workspace = await prisma.workspace.create({
        data: {
          teamId,
          name,
          description,
          settings: settings || {}
        }
      });

      // Log activity
      await createActivityLog({
        userId,
        action: 'CREATE',
        resource: 'WORKSPACE',
        resourceId: workspace.id,
        metadata: { 
          teamId,
          workspaceName: name 
        }
      });

      res.status(201).json({
        success: true,
        data: workspace
      });
    } catch (error) {
      console.error('Error creating workspace:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create workspace'
      });
    }
  }
);

/**
 * GET /api/teams/:id/activity
 * Get team activity feed
 */
router.get('/:id/activity', async (req, res) => {
  try {
    const { id: teamId } = req.params;
    const userId = req.user!.id;

    // Check if user is member of the team
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });

    if (!teamMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You are not a member of this team.'
      });
    }

    // Get team member IDs
    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId },
      select: { userId: true }
    });

    const memberIds = teamMembers.map(m => m.userId);

    // Get recent activity for team members
    const activities = await prisma.activityLog.findMany({
      where: {
        userId: {
          in: memberIds
        }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 50
    });

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching team activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch team activity'
    });
  }
});

export default router; 