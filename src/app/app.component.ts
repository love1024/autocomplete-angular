import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { HttpClientModule } from '@angular/common/http';

interface Address {
  address1: string;
  city: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AutocompleteComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'autocomplete';
  mapper = (address: Address) => `${address.address1}, ${address.city}`;
  sorter = (a: string, b: string) => a.localeCompare(b);
}
