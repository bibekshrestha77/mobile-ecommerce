import { IPayload } from "./interface.types";

declare global {
    namespace Express {
        interface Request {
            user:IPayload | null
        }
    }
}