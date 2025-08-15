//TODO: Impement other returns.
export class Storage {
    private key : string;

    constructor(key: string) {
        this.key = key;
    }

    save(value : Array<any>) : boolean {
        try {
            localStorage.setItem(this.key, JSON.stringify(value));
            return true;
        } catch (err) {
            console.error("Could not save to localStorage", err);
            return false;
        }
    }

    load() : Array<any> | null {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : null;
        } catch (err) {
            console.error("Could not read from localStorage", err);
            return null;
        }
    }

    remove() : void {
        localStorage.removeItem(this.key);
    }
}