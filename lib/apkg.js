//source:
//https://github.com/NdYAG/anki-apkg
Database = require('better-sqlite3');
path=require('path');
sql=require('./sql');
fs=require('fs');
rimraf=require('rimraf');
archiver = require('archiver');
sha1=require('sha1');
class APKG {
    constructor(config) {
        this.config = config;
        this.dest = path.join(__dirname, config.name);
        this.clean();
        fs.mkdir(this.dest, (err) => {
          if (err) {
            return console.error(err);
          }
          console.log('Directory created successfully!');
        });
        this.db = new Database(path.join(this.dest, 'collection.anki2'));
        this.deck = Object.assign(Object.assign({}, config), { id: +new Date() });
        sql.initDatabase(this.db, this.deck);
        this.mediaFiles = [];
    }
    addCard(card) {
        sql.insertCard(this.db, this.deck, card);
    }
    addMedia(filename, data) {
        const index = this.mediaFiles.length;
        this.mediaFiles.push(filename);
        fs.writeFileSync(path.join(this.dest, `${index}`), data);
    }
    save(destination) {
        const directory = path.join(__dirname, this.config.name);
        const archive = archiver('zip');
        const mediaObj = this.mediaFiles.reduce((obj, file, idx) => {
            obj[idx] = file;
            return obj;
        }, {});
        fs.writeFileSync(path.join(this.dest, 'media'), JSON.stringify(mediaObj));
        archive.directory(directory, false);
        archive.pipe(fs.createWriteStream(path.join(destination, `${this.config.name}.apkg`)));
        archive.finalize();
        archive.on('end', this.clean.bind(this));
    }
    clean() {
        rimraf(this.dest, () => { });
    }
}
module.exports = {APKG}
