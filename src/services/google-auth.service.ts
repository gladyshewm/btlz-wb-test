import { Auth, google } from "googleapis";

export class GoogleAuthService {
    createGoogleAuth(): Auth.GoogleAuth {
        return new google.auth.GoogleAuth({
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
    }
}
