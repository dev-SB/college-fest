import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {UserAuthService} from '../user-auth.service';
import {FirebaseDatabaseService} from '../firebase-database.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {


  constructor(public auth: UserAuthService,
              public dbService: FirebaseDatabaseService
  ) {
  }

  ngOnInit() {
  }

}
