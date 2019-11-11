import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsPageRoutingModule } from './reports-page-routing.module';
import { ReportsPageComponent , editIncidentDialog } from './reports-page.component';
import { MaterialModule } from '../../material.module'; 
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { pdfmake } from 'pdfmake';


@NgModule({
    entryComponents: [
        editIncidentDialog
    ],
    declarations: [
        ReportsPageComponent,
        editIncidentDialog
    ],
    imports: [CommonModule, ReportsPageRoutingModule , MaterialModule ,  SweetAlert2Module.forRoot() , pdfmake],
})
export class ReportsPageModule {}
