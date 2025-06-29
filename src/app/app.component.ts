import { Component } from '@angular/core';
import { TablesComponent } from "./componet/tables/tables.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TablesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-task';
}
