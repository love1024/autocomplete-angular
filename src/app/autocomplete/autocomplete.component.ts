import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  Input,
  OnInit,
  Output,
  TemplateRef,
  inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs';
import { AutocompleteService } from './autocomplete.service';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css',
  providers: [AutocompleteService],
})
export class AutocompleteComponent implements OnInit {
  private subject$ = new Subject<string>();
  private service = inject(AutocompleteService);
  query = '';
  showResults = false;
  loading = false;
  results: unknown[] = [];
  @ContentChild(TemplateRef) templateRef?: TemplateRef<any>;
  @Input() mapper = (d: any) => d;
  @Input() sorter?: (a: any, b: any) => number;
  @Input() toAString = (d: any) => JSON.stringify(d);
  @Output() selected$ = new Subject<unknown>();

  ngOnInit(): void {
    this.callApiOnChanges();
  }

  onInput(e: Event): void {
    this.loading = this.results.length === 0;
    if (this.query.length > 2) {
      this.showResults = true;
      this.subject$.next(this.query);
    } else {
      this.showResults = false;
      this.loading = false;
      this.results = [];
    }
  }

  onSelection(selected: unknown): void {
    this.query =
      typeof selected !== 'string' ? this.toAString(selected) : selected;
    this.showResults = false;
    this.selected$.next(selected);
  }

  private callApiOnChanges(): void {
    this.subject$
      .pipe(
        filter((input: string) => input.length > 2),
        debounceTime(250),
        switchMap((input) => this.service.getSearchResults(input))
      )
      .subscribe((r) => {
        this.loading = false;
        if (r.length > 0) {
          r = r.map(this.mapper);
          this.sorter && r.sort(this.sorter);
          this.results = r;
        }
      });
  }
}
