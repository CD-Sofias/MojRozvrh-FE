import {Component, ViewEncapsulation} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  public items: ItemModel[] = [
    {
      text: 'Schedule',
      iconCss: 'e-icons e-agenda-date-range'
    },
    {
      text: 'My schedule',
      iconCss: 'e-icons e-timeline-work-week',
    },
    {
      text: 'Log Out',
      iconCss: 'e-ddb-icons e-logout',
      url: "/auth"
    }];

  isSmallScreen: boolean;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([
      '(max-width: 599px)'
    ]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  }
}
