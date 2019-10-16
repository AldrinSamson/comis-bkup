import { StaffViewPageComponent } from './staff-view-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [ {path:'',component:StaffViewPageComponent,data:{shouldReuse:true,key:'staff-view'}},  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffViewPageRoutingModule { }
