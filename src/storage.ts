//TODO: Impement other returns.
class storage {
    save(key : string, value : string) : void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error("Could not save to localStorage", err);
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