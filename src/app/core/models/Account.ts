import { TableMap } from '../services/tableMap/table-map';
import { IDataBaseObj } from './_base';

export interface IAccount extends IDataBaseObj {

    accountID?: string;
    username?: string;
    password?: string;
    class?: string;
    firstName?: string;
    lastName?: string;
    securityAnswer1?: string,
    securityAnswer2?: string

}

export class Account implements IAccount {

    static tableName: string = TableMap.Account;

    id: string;

    class?: string;
    type?: string;

    constructor(props: IAccount) {
        Object.keys(props).forEach(prop => {
            const value = prop[prop];
            this[prop] = value;
        })
    }

}