import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(private http: HttpClient) {}

	isAuthenticated() {
		const token = this.getToken();
		if (token) {
			const { exp } = jwt_decode<{ exp: number }>(token);
			if (Date.now() > exp * 1000) {
				return of(false);
			}
			return of(true);
		}
		return of(false);
	}

	getAuthenticatedUserUsername() {
		const token = this.getToken();
		const { sub } = jwt_decode<{ sub: string }>(token);
		return sub;
	}

	private booksUrl = `${environment.production
		? 'https://obes-api.herokuapp.com/'
		: 'http://localhost:8080'}/books`;

	signIn(username: string, password: string) {
		return this.http
			.post(
				environment.production
					? 'https://obes-api.herokuapp.com/login'
					: 'http://localhost:8080/login',
				{
					username: username,
					password: password
				},
				{ responseType: 'text' }
			)
			.pipe(map((response) => localStorage.setItem('@token', response)));
	}

	signUp(name: string, username: string, password: string) {
		return this.http
			.post(
				environment.production
					? 'https://obes-api.herokuapp.com/signup'
					: 'http://localhost:8080/signup',
				{
					name: name,
					username: username,
					password: password
				}
			)
			.pipe(map((response) => {}));
	}

	getToken() {
		const token = localStorage.getItem('@token') || '';
		return token;
	}
}
