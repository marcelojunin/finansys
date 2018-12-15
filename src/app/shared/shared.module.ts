import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
  CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [BreadCrumbComponent],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    BreadCrumbComponent,
    RouterModule,
  ]
})
export class SharedModule { }
