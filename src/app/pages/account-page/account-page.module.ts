import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountPageRoutingModule } from './account-page-routing.module';
import { AccountPageComponent , addAccountDialog , editAccountDialog } from './account-page.component';
import { MaterialModule } from '../../material.module';

@NgModule({
  entryComponents: [
    addAccountDialog,
    editAccountDialog
  ],
  declarations: [
    AccountPageComponent, 
    addAccountDialog,
    editAccountDialog ],
  imports: [
    CommonModule,
    AccountPageRoutingModule,
    MaterialModule
  ]
})
export class AccountPageModule { }
