const fs = require('fs');

/**
 * Simple logger that writes the log string message to a .txt file
 */
class Logger{
    /**
     * 
     * @param {String} logs_path path to the file holding logs
     */
    constructor(logs_path){
        this.logs = logs_path;
    }

    /**
     * 
     * @param {String} data log message
     */
    log(data){
        fs.appendFile(this.logs, data+'\n', 'utf8', (err) => {
            if (err){
                console.error(err);
            }
        })
    }
}

module.exports = Logger;