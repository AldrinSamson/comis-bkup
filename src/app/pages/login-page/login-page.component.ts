import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../../core/services/storage/storage.service';
import { StorageKey } from '../../core/services/storage/storage.model';

const { AUTH_TOKEN } = StorageKey;

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
    email: string;
    password: string;
    errorMessage: string;
    userInfo : any;

    constructor(private authService: AuthService, private router: Router ,   private storage: StorageService) {}

    ngOnInit() {
        this.errorMessage = '';
        // if (this.authService.isLogged()) {
        //     this.navigateTo();
        // }
        
    }

    public async login(username: string, password: string) {
        try {
            const url = (await this.authService.login(
                username,
                password,
            )) as string;

            this.userInfo = Object.values(this.storage.read(AUTH_TOKEN))[0];

            if (this.userInfo.class == "Administrator"){
                this.navigateTo(url);
            }else {
                //this.storage.remove(AUTH_TOKEN);
                this.router.navigate(['staff-view']);
            }
           
        } catch (e) {
            this.errorMessage = 'Wrong Credentials!';
            console.error('Unable to Login!\n', e);
        }
    }

    public navigateTo(url?: string) {
        url = url || 'admin';
        this.router.navigate([url], { replaceUrl: true });
    }
}
