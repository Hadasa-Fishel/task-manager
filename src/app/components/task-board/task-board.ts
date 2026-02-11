import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TasksService } from '../../services/tasks.service';
import { Task } from '../../models/types.model';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, DatePipe,
    MatButtonModule, MatIconModule, MatInputModule, 
    MatFormFieldModule, MatSelectModule, MatMenuModule
  ],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css'
})
export class TaskBoard implements OnInit {
  tasksService = inject(TasksService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  projectId!: number;
  
  // משתנים למודל עריכה/יצירה
  showModal = false;
  isEditing = false;
  currentEditingId: number | null = null;

  // חלוקת המשימות לעמודות (Computed Signals)
  todoTasks = computed(() => this.tasksService.projectTasks().filter(t => t.status === 'todo'));
  inProgressTasks = computed(() => this.tasksService.projectTasks().filter(t => t.status === 'in-progress'));
  doneTasks = computed(() => this.tasksService.projectTasks().filter(t => t.status === 'done'));

  // הטופס
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    priority: ['MEDIUM'], // ברירת מחדל
    status: ['todo']
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = Number(params['projectId']);
      if (this.projectId) {
        this.tasksService.loadTasks(this.projectId).subscribe();
      }
    });
  }

  // פתיחת חלונית להוספה
  openAddModal(status: 'todo' | 'in-progress' | 'done' = 'todo') {
    this.isEditing = false;
    this.currentEditingId = null;
    this.taskForm.reset({ status: status, priority: 'MEDIUM' }); // מאפס לסטטוס של העמודה
    this.showModal = true;
  }

  // פתיחת חלונית לעריכה
  openEditModal(task: Task) {
    this.isEditing = true;
    this.currentEditingId = task.id;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority || 'MEDIUM',
      status: task.status
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveTask() {
    if (this.taskForm.invalid) return;

    const formValue = this.taskForm.value;
    const payload = {
      ...formValue,
      projectId: this.projectId
    } as any;

    if (this.isEditing && this.currentEditingId) {
      // עדכון
      this.tasksService.updateTask(this.currentEditingId, payload).subscribe(() => this.closeModal());
    } else {
      // יצירה
      this.tasksService.createTask(payload).subscribe(() => this.closeModal());
    }
  }

  // העברה מהירה בין עמודות
  moveTask(task: Task, newStatus: 'todo' | 'in-progress' | 'done') {
    this.tasksService.updateTask(task.id, { status: newStatus }).subscribe();
  }

  deleteTask(taskId: number) {
    if(confirm('Delete this task?')) {
      this.tasksService.deleteTask(taskId).subscribe();
    }
  }
}