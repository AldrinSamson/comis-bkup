import { ForgotPasswordPageComponent } from './forgot-password-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [ {path:'',component:ForgotPasswordPageComponent,data:{shouldReuse:true,key:'forgot-password'}},  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotPasswordPageRoutingModule { }
