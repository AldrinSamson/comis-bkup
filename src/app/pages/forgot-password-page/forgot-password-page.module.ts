import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordPageRoutingModule } from './forgot-password-page-routing.module';
import { ForgotPasswordPageComponent , resetDialog , questionDialog } from './forgot-password-page.component';
import { MaterialModule } from '../../material.module';
import { LogoModule } from '../../core/components/logo/logo.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  entryComponents : [
    resetDialog,
    questionDialog
  ],
  declarations: [
    ForgotPasswordPageComponent,
    resetDialog,
    questionDialog
  ],
  imports: [
    CommonModule,
    ForgotPasswordPageRoutingModule,
    LogoModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class ForgotPasswordPageModule { }
