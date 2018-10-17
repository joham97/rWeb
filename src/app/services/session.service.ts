import { Injectable } from '@angular/core';
import { Session } from '../entities/interfaces';
import { RestService } from './rest.service';

// Session-Service 
@Injectable()
export class SessionService {

    private session: Session;

    // Konstruktor
    //  - enthält RestService
    //  - läd die Session aus dem Local-Storage
    constructor(private restService: RestService) {
        const sessionJson = localStorage.getItem('session');
        if (sessionJson) {
            try {
                this.session = JSON.parse(sessionJson);
            } catch (err) {
                this.removeSession();
            }
        }
    }

    // Überprüfung, ob Session vorhanden ist
    public hasSession(): boolean {
        return this.session !== null && this.session !== undefined;
    }

    // Setze den Session-Parameter und im Local Storage
    public setSession(session: Session) {
        this.session = session;
        localStorage.setItem('session', JSON.stringify(session));
    }

    // Entfernen des Session-Parameters und aus dem Local Storage
    public removeSession() {
        this.session = null;
        localStorage.removeItem('session');
    }

    // Session laden
    public getSession(): Session {
        return this.session;
    }

}
