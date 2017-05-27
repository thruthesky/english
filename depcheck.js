var fs = require('fs');
var dir = require('node-dir');


dir.files('src', function (err, files) {
    if (err) throw err;

    var count = 0;

    var re = /\.ts|scss|html$/;

    var usedImages = [];

    for (var f of files) {

        if (!re.test(f)) continue;
        count++;


        var content = fs.readFileSync(f);
        var text = content.toString(); // file content

        var reImage = /([0-9a-zA-Z_\-]+\.(jpg|png|gif))/g;
        var images = [];
        while ((arr = reImage.exec(text)) !== null) {
            var img = arr[0];
            images.push( img );
            usedImages.push( img );
        }

        if (images.length) {
            console.log(`Found in : ${f}`);
            console.log(images);
            console.log("\n");
        }

    }


    var A = files.filter( v => /\.(jpg|gif|png|psd)/.test( v ) );
    var B = usedImages;
    var C = A.filter( a => B.findIndex( b => a.indexOf( b ) != -1 ) == -1 );


    console.log("Unused Images: ");
    for (let f of C) {
        console.log(f);
    }

});

//