import { TableMap } from '../services/tableMap/table-map';
import { IDataBaseObj } from './_base';

export interface IAudit extends IDataBaseObj {

    date?: Date;
    actionType?: string;
    actor?: string;

}

export class Audit implements IAudit {

    static tableName: string = TableMap.Audit;

    id: string;

    date?: Date;
    actionType?: string;
    actor?: string;

    constructor(props: IAudit) {
        Object.keys(props).forEach(prop => {
            const value = prop[prop];
            this[prop] = value;
        })
    }

}