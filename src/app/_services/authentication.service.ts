import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../lobby/login/user';

const httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Origin': 'http://localhost:4200', // -->Add this line
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    })
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    config : any;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.config = ({
            apiUrl: 'http://localhost:3000'
        })
    }


    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }


    login(externalType: string, externalID: string, username: string, password: string, ) {
        console.log("me here")
        return this.http.post<any>(`${this.config.apiUrl}/login`, { externalType, externalID, username, password }, httpOptions )
            .pipe(map(user => {
                
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    console.log(user.token)
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user; 
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}