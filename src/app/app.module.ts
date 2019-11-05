import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavModule } from './core/components/nav/nav.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpConfigInterceptor } from './core/services/http/interceptor.service';
import { CrudServiceModule } from './core/services/genericCRUD/crud-service.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {DatePipe} from '@angular/common';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        NavModule,
        HttpClientModule,
        CrudServiceModule,
        MDBBootstrapModule,
        SweetAlert2Module.forRoot()
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpConfigInterceptor,
            multi: true,
        },
        DatePipe
    ],

    bootstrap: [AppComponent],
})
export class AppModule {
}
