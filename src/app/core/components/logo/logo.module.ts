import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent , Logo2Component } from './logo.component';

@NgModule({
    declarations: [LogoComponent , Logo2Component],
    exports: [LogoComponent , Logo2Component],
    imports: [CommonModule],
})
export class LogoModule {}
