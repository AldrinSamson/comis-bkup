import { Injectable } from '@angular/core';
import { CrudService } from '../core/services/http/crud.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../core/services/storage/storage.service';
import { StorageKey } from '../core/services/storage/storage.model';
import { Account } from '../core/models/Account';
import { DataService } from '../core/services/genericCRUD/data.service';
import { Audit } from '../core/models/Audit';
import swal from 'sweetalert2';


const { AUTH_TOKEN } = StorageKey;

@Injectable({
    providedIn: 'root',
})
@Injectable({
    providedIn: 'root',
})
export class AuthService extends CrudService {
    endpoint = 'auth';
    token: any;
    redirectUrl: string;

    constructor(http: HttpClient, private storage: StorageService ,  public DS: DataService,) {
        super(http);
        this.token = this.storage.read(AUTH_TOKEN) || '';
    }

    public async login(email: string, password: string) {
        try {
            let type = 'login';
            let query = 'user=' + email + '&' + 'pass=' + password;
            const promise = this.DS.readPromise(Account , type , query);
            const [res] = await Promise.all([promise]);

            if (res.length == 0) {
                swal.fire({
                    title: 'Error!',
                    text: 'Incorrect Credentials',
                    type: 'error',
                    confirmButtonText: 'OK'
                  })
            }else {

                let audit = {
                    date : new Date , 
                    actionType : 'Login' , 
                    actor : email 
                }

                this.token =res;
                this.DS.createPromise(Audit , audit);
                this.storage.save(AUTH_TOKEN, this.token);
                return this.redirectUrl;
            }
        } catch (error) {
            console.error('Error during login request', error);
            return Promise.reject(error);
        }
    }

    public async mockLogin(email: string, password: string) {
        try {
            if (!(email === 'user' && password === 'user')) {
                throw new Error(
                );
            }
            this.token = 'user';
            this.storage.save(StorageKey.AUTH_TOKEN, this.token);
            return this.redirectUrl;
        } catch (e) {
            return Promise.reject(e.message);
        }
    }

    public getToken(): string {
        return this.token;
    }

    public logout() {
        let userInfo : any;
        userInfo = Object.values(this.storage.read(AUTH_TOKEN))[0];
        let audit = {
            date : new Date , 
            actionType : 'Logout' , 
            actor : userInfo.username 
        }
        this.token = '';
        this.DS.createPromise(Audit, audit);
        this.storage.remove(AUTH_TOKEN);
    }

    public isLogged(): boolean {
        let userInfo : any;
        let isLogged = new Boolean(false);
        userInfo = Object.values(this.storage.read(AUTH_TOKEN))[0];
        if (userInfo.class == "Administrator"){
            isLogged = true;
        }
        return userInfo.class == "Administrator";
    }
}
