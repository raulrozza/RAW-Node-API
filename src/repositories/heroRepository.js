const { promises } = require('fs');

class HeroRepository {
    constructor({ file }) {
        this.file = file;
    }

    async _currentFileContent() {
        return JSON.parse(await promises.readFile(this.file));
    }

    async find(itemId) {
        const all = await this._currentFileContent();

        if (!itemId) return all;

        return all.find(({ id }) => itemId === id);
    }

    async create(data) {
        const currentFile = await this._currentFileContent();
        currentFile.push(data);

        await promises.writeFile(this.file, JSON.stringify(currentFile));

        return data.id;
    }
}

module.exports = HeroRepository;
