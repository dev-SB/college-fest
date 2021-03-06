import {Injectable} from '@angular/core';
import {User} from './user';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {debounceTime, first, reduce, switchMap, take} from 'rxjs/operators';
import {Observable, of, OperatorFunction} from 'rxjs';
import {Router} from '@angular/router';
import {SnackbarService} from './snackbar.service';
import {CustomSnackbarService} from './custom-snackbar.service';


@Injectable({
  providedIn: 'root'
})

export class FirebaseDatabaseService {
  loggedInUserData: User;
  dataEvent;

  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router,
              private snackBar: SnackbarService,
              private customSnackbar: CustomSnackbarService
  ) {
    // console.log('read data called-user-db');
    this.subscribeData();
  }

  createUserData(userRef, user) {
    const data = {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      newUser: true,
      phoneNo: '',
      pinCode: '',
      gender: '',
      city: '',
      state: '',
      college: '',
      address: '',
      transport: '-1',
      participatingEvents: {
        0: false, 1: false, 2: false, 3: false, 4: false, 5: false,
        6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false,
        16: false, 17: false, 18: false, 19: false, 20: false, 21: false, 22: false, 23: false, 24: false
      }

    };
    // this.customSnackbar.showSnackBar('Hi ' + user.displayName + ', Welcome Onboard!', '', 3);
    return userRef.set(data, {merge: true});
  }

  subscribeData() {
    this.readData().subscribe((userData) => {
      this.loggedInUserData = userData;
    });
  }

  readData(): Observable<User> {
    // console.log('read data called');
    return this.afAuth.authState.pipe(
      switchMap(user => {
          if (user) {
            return this.afs.collection('users').doc(`${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        }
      )
    );
  }

  updateData(data) {
    if (data) {
      // console.log('up');
      // console.log(this.dataEvent);
      this.afs.collection('users').doc(this.loggedInUserData.id).set(data, {merge: true});
      console.log(data);
    } else {
      // console.log('dn');
      // console.log(this.dataEvent);
      this.afs.collection('users').doc(this.loggedInUserData.id).set(this.dataEvent, {merge: true});
      // this.directToForm(this.dataEvent);
    }
  }

  directToForm(data) {
    if (Object.keys(data.participatingEvents)[0] === '15') {
      window.open('https://www.hackerearth.com/challenges/college/codextreme2019/', '_blank');
    } else if (Object.keys(data.participatingEvents)[0] === '7') {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSc0REkmrqtBB5vT_zC0b235fjveewi8ZTGVCtIp5EXJ5bX71A/viewform', '_blank');
    }
  }

  registerEvent(data, team) {
    if (this.loggedInUserData.participatingEvents[Object.keys(data.participatingEvents)[0]]) {
      this.customSnackbar.showSnackBar('You have already registered for this event', '', 3);
      // this.directToForm(data);
    } else {
      if (this.loggedInUserData.newUser) {
        this.dataEvent = data;
        this.router.navigate(['/register']);
      } else {
        this.updateData(data);
        this.customSnackbar.showSnackBar('You have successfully registered for the event.', '', 3);
        // this.directToForm(data);
        if (team) {
          const createTeamSnackbarRef = this.snackBar.showSnackBar('Successfully registered, create your team', 'Go!', 5);
          createTeamSnackbarRef.onAction().subscribe(() => {
            createTeamSnackbarRef.dismiss();
            this.router.navigate(['/profile']);
          });
        }
      }
    }
  }

  userSignedIn(user, route) {
    const userRef: AngularFirestoreDocument<User> = this.afs.collection('users').doc(`${user.uid}`);
    // console.log('create user data');
    userRef.ref.get().then((snapshot) => {
      if (!snapshot.exists) {
        // console.log('in');
        // console.log(snapshot.exists);
        return this.createUserData(userRef, user);
      }
    });
    // this.router.navigate([route]);

  }

  findUser(email) {
    return this.afs.collection('users',
      ref => ref.where('email', '==', email).limit(1))
      .valueChanges().pipe();
  }

  findTeam(teamName) {
    return this.afs.collection('teams').doc(teamName).valueChanges().pipe();
  }


  teamRegister(event, teamName, data) {
    const id = data.id;
    const eveObj = data;
    eveObj.participatingEvents[event] = teamName;
    // console.log('eve');
    // console.log(eveObj);
    const signObj = this.loggedInUserData;
    signObj.participatingEvents[event] = teamName;
    // console.log(signObj);
    this.afs.collection('users').doc(id).set(eveObj);
    this.afs.collection('users').doc(this.loggedInUserData.id).set(signObj);
    let teamStatus = [];
    this.findTeam(teamName).pipe(take(1)).subscribe(team => {
      // console.log(team);
      if (team) {
        if (team.hasOwnProperty('id')) {
          teamStatus = (team as any).id;
        }
      }
      const teamStatusArr = Object.keys(teamStatus).map(key => teamStatus[key]);
      teamStatusArr.push(event);
      this.afs.collection('teams').doc(teamName).set({id: teamStatusArr}, {merge: true});
    });
    this.customSnackbar.showSnackBar('Team created successfully', '', 3);
  }
}

