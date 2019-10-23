import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Page } from '../../../services/navigation/navigation.service';

import { StorageService } from '../../../services/storage/storage.service'
import { StorageKey } from '../../../services/storage/storage.model';
import { MatDialogRef } from '@angular/material';
const { AUTH_TOKEN } = StorageKey;

@Component({
    selector: 'app-nav-toolbar',
    templateUrl: './nav-toolbar.component.html',
    styleUrls: ['./nav-toolbar.component.scss'],
})
export class NavToolbarComponent implements OnInit {
    @Input() activePage: Page;
    @Input() previousUrl: string[];
    @Output() toggleSideNav = new EventEmitter();
    @Output() logout = new EventEmitter();
    public addToggled = false;
    public userInfo : any;
   

    constructor( public storage : StorageService) {}

    ngOnInit() {
        this.userInfo =  Object.values(this.storage.read(AUTH_TOKEN))[0];
    }

    public onToggleSideNav() {
        this.toggleSideNav.emit();
    }

    public onLogout() {
        this.logout.emit();
    }
}

