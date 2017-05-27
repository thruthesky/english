var fs = require('fs');

var dirs = fs.readdirSync( 'src' );

for( var f of dirs ) {
    console.log(f);
}
