//TODO: Impement other returns.
export class Storage {
    save(key : string, value : string) : boolean {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (err) {
            console.error("Could not save to localStorage", err);
            return false;
        }
    }

    load(key : string) : string | null {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (err) {
            console.error("Could not read from localStorage", err);
            return null;
        }
    }

    remove(key : string) : void {
        localStorage.removeItem(key);
    }
}