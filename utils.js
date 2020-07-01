// ref: https://stackoverflow.com/a/1349426/7076956 
module.exports.idGen = () => {
        let result           = '';
        const characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( let i = 0; i < 32; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
           if (i == 7 || i == 11 || i == 15 || i == 19){
               result += '-';
           }
        }
        return result;
}
