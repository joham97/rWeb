import { Injectable } from '@angular/core';
import { Session } from '../entities/interfaces';
import { RestService } from './rest.service';

// Service that holds the session and persists it
@Injectable()
export class SessionService {

    // Session object
    private session: Session;

    // Load session object from local storage
    constructor() {
        const sessionJson = localStorage.getItem('session');
        if (sessionJson) {
            try {
                this.session = JSON.parse(sessionJson);
            } catch (err) {
                this.removeSession();
            }
        }
    }

    // Is there a session object?
    public hasSession(): boolean {
        return this.session !== null && this.session !== undefined;
    }

    // Set session object and persist it to the local storage
    public setSession(session: Session) {
        this.session = session;
        localStorage.setItem('session', JSON.stringify(session));
    }

    // Remove session object and remove the persisted object in the local storage
    public removeSession() {
        this.session = null;
        localStorage.removeItem('session');
    }

    // Get Session
    public getSession(): Session {
        return this.session;
    }

}
