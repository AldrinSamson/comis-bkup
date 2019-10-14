import { Component, OnInit, Inject} from '@angular/core';
import { DataService } from '../../core/services/genericCRUD/data.service'


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {

    ngOnInit() {
       
    } 
    
  public chartType: string = 'pie';
  public chartDatasetsItem: Array<any> = [
    { data: [50, 10, 70, 27 , 15], label: 'Items' }
  ];

  public chartLabelsItem: Array<any> = ['Violin', 'Cello', 'Caddy', 'Coat', 'Drum'];

  public chartDatasetsBorrower: Array<any> = [
    { data: [22, 5, 9, 13 , 11], label: 'Borrower' }
  ];

  public chartLabelsBorrower: Array<any> = ['John Doe', 'Edward Elric', 'Winry Rockbell', 'Van Hohenheim', 'Scar Face'];

  public chartColors: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774'],
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true,
    size : "Chart"
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }
}
