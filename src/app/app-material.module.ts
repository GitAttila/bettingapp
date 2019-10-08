import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  imports: [
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatCardModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  exports: [
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatCardModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ]
})
export class AppMaterialModule {}
