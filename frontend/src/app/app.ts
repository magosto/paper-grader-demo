import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GraderService } from './grader.service';
import { GradeResponse } from './grade-result.model';

const ACCEPTED_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly selectedFile = signal<File | null>(null);
  protected readonly isGrading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly result = signal<GradeResponse | null>(null);
  protected readonly showExtractedText = signal(false);
  protected readonly isDragOver = signal(false);

  constructor(private grader: GraderService) {}

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.handleFileSelection(file);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files?.[0] ?? null;
    this.handleFileSelection(file);
  }

  private handleFileSelection(file: File | null): void {
    if (!file) {
      return;
    }
    if (!ACCEPTED_TYPES.has(file.type)) {
      this.error.set('Unsupported file type. Please upload a .pdf or .docx file.');
      return;
    }
    this.selectedFile.set(file);
    this.result.set(null);
    this.error.set(null);
  }

  clearFile(): void {
    this.selectedFile.set(null);
    this.result.set(null);
    this.error.set(null);
  }

  submit(): void {
    const file = this.selectedFile();
    if (!file) {
      return;
    }
    this.isGrading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.grader.gradePaper(file).subscribe({
      next: (response) => {
        this.result.set(response);
        this.isGrading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.isGrading.set(false);
      },
    });
  }

  toggleExtractedText(): void {
    this.showExtractedText.update((v) => !v);
  }

  scoreClass(score: number): string {
    if (score >= 85) return 'score-high';
    if (score >= 65) return 'score-mid';
    return 'score-low';
  }
}
