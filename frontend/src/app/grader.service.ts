import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { GradeResponse } from './grade-result.model';

const API_BASE = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class GraderService {
  constructor(private http: HttpClient) {}

  gradePaper(file: File): Observable<GradeResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<GradeResponse>(`${API_BASE}/grade`, formData).pipe(
      catchError((err: HttpErrorResponse) => {
        const message = err.error?.error ?? err.message ?? 'Unknown error while grading paper.';
        return throwError(() => new Error(message));
      })
    );
  }
}
