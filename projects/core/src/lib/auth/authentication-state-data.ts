import { AuthenticatedUser } from "./authenticated-user";

export interface AuthenticationStateData {
    authenticated: boolean;
    user?: AuthenticatedUser;
    token?: string;
}