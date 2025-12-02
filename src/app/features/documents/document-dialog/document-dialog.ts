import { Component, Inject } from '@angular/core';
import { DocumentStatus } from '../../../core/models/document.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DocumentsActions } from '../state/documents.actions';
import { selectDocumentById } from '../state/documents.selectors';
import { filter } from 'rxjs';

interface DialogData {
  mode: 'create' | 'edit';
  documentId?: number;
}

@Component({
  selector: 'app-document-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './document-dialog.html',
  styleUrl: './document-dialog.scss',
})
export class DocumentDialogComponent {
  readonly statuses: DocumentStatus[] = ['DRAFT', 'SIGNED', 'ARCHIVED'];

  form;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    protected readonly dialogRef: MatDialogRef<DocumentDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly store: Store,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      status: ['DRAFT' as DocumentStatus, Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.documentId != null) {
      this.store.dispatch(DocumentsActions.loadOne({ id: this.data.documentId }));
      this.store
        .select(selectDocumentById(this.data.documentId))
        .pipe(filter(Boolean))
        .subscribe((doc) => {
          this.form.patchValue({
            title: doc!.title,
            author: doc!.author,
            status: doc!.status,
            content: doc!.content,
          });
        });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.store.dispatch(
        DocumentsActions.create({
          payload: value as any,
        }),
      );
    } else if (this.data.documentId != null) {
      this.store.dispatch(
        DocumentsActions.update({
          id: this.data.documentId,
          changes: value as any,
        }),
      );
    }

    this.dialogRef.close();
  }
}
