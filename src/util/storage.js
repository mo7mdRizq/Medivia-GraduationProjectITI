export const db = {
    /**
     * Get the entire database object
     */
    getAll() {
        try {
            const data = localStorage.getItem('db');
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return {};
        }
    },

    /**
     * Get a specific key from the database
     */
    get(key) {
        return this.getAll()[key];
    },

    /**
     * Set a specific key in the database
     */
    set(key, value) {
        const data = this.getAll();
        data[key] = value;
        localStorage.setItem('db', JSON.stringify(data));
    },

    /**
     * Remove a specific key from the database
     */
    remove(key) {
        const data = this.getAll();
        delete data[key];
        localStorage.setItem('db', JSON.stringify(data));
    },

    /**
     * Update the database using a function
     */
    update(key, fn) {
        const data = this.getAll();
        data[key] = fn(data[key]);
        localStorage.setItem('db', JSON.stringify(data));
    },

    /**
     * Clear the entire database
     */
    clear() {
        localStorage.removeItem('db');
    }
};
