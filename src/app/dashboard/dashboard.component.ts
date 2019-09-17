import {Component, OnInit} from '@angular/core';
import {UserAuthService} from '../user-auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public auth: UserAuthService) {
  }

  ngOnInit() {
  }

}
