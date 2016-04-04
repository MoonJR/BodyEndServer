/**
 * Created by MoonJR on 2016. 4. 1..
 */
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 30,
    host: 'yeonjukko.net',
    user: 'yeonjukko',
    password: 'eldeldeld',
    database: 'bodyend'
});


String.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

exports.mysqlPool = pool;