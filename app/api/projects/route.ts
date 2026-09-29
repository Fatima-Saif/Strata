import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all projects and tasks from SQLite
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true, role: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create project or task in SQLite
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type === 'task') {
      // Create or update task
      const { id, title, column, priority, projectId, assigneeId } = body;
      
      if (id) {
        // Update task column (e.g. kanban drag and drop)
        const updatedTask = await prisma.task.update({
          where: { id },
          data: {
            column: column || undefined,
            priority: priority || undefined,
          },
        });
        return NextResponse.json({ success: true, task: updatedTask });
      }

      const newTask = await prisma.task.create({
        data: {
          title,
          column: column || 'todo',
          priority: priority || 'normal',
          projectId,
          assigneeId,
        },
      });
      return NextResponse.json({ success: true, task: newTask }, { status: 201 });
    }

    // Create new Project
    const { name, description, priority, dueDate } = body;
    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project/task:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
