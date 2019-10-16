import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffViewPageRoutingModule } from './staff-view-page-routing.module';
import { StaffViewPageComponent , addBorrowerDialog ,editBorrowerDialog ,borrowDialog , returnDialog , incidentDialog } from './staff-view-page.component';
import { MaterialModule } from '../../material.module'

@NgModule({
  entryComponents : [
    addBorrowerDialog,
    editBorrowerDialog,
    borrowDialog, 
    returnDialog, 
    incidentDialog
  ],
  declarations: [
    StaffViewPageComponent,
    addBorrowerDialog,
    editBorrowerDialog,
    borrowDialog, 
    returnDialog, 
    incidentDialog
  ],
  imports: [
    CommonModule,
    StaffViewPageRoutingModule,
    MaterialModule
  ]
})
export class StaffViewPageModule { }
