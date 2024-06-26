import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ItemModel} from '@syncfusion/ej2-angular-splitbuttons';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {MenuEventArgs} from "@syncfusion/ej2-navigations";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

  public items: ItemModel[] = [{
    text: 'Admin panel', iconCss: 'e-icons e-edit-3', id: "admin-panel",
  }, {
    text: 'Log Out', iconCss: 'e-ddb-icons e-logout', id: "logout",
  },];

  public scheduleItems: ItemModel[] = [{
    text: 'Schedule', iconCss: 'e-icons e-agenda-date-range', url: '/schedule'
  }, {
    text: 'My schedule', iconCss: 'e-icons e-timeline-work-week', url: '/my-schedule'
  }];

  isSmallScreen: boolean;
  username: string;
  role: string;

  constructor(private breakpointObserver: BreakpointObserver, private userService: UserService, private authService: AuthService, private router: Router) {
    this.breakpointObserver.observe(['(max-width: 599px)']).subscribe(result => {
      this.isSmallScreen = result.matches;
      if (this.isSmallScreen) {
        this.items = [...this.scheduleItems, ...this.items];
      } else {
        this.items = this.items.filter(item => !this.scheduleItems.includes(item));
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.userService.getUsersInfo().subscribe(user => {
        this.username = user.username;
        this.role = user.role;

        if (this.role !== 'ADMIN') {
          this.items = this.items.filter(item => item.text !== 'Admin panel');
        }
        if (this.role == 'ADMIN') {
          this.scheduleItems = this.scheduleItems.filter(item => item.text !== 'My schedule');
        }
      });
    }
  }

  public select(args: MenuEventArgs) {
    if (args.item.text === 'Log Out') {
      this.logout();
    } else if (args.item.text === 'Admin panel') {
      this.router.navigate(['admin-panel']);
    } else if (args.item.text === 'Login') {
      this.router.navigate(['auth/login']);
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['auth/login']);
  }
}
