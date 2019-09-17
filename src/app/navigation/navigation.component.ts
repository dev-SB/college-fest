import {Component, OnInit} from '@angular/core';
import {UserAuthService} from '../user-auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(public auth: UserAuthService) {
  }

  ngOnInit() {
  }

}
