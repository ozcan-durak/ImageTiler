/** ImageTiler with NodeJS
 *  ================================================================================
 *  Node Js service to serve ImageTiles,
 *  ================================================================================
 *  @category
 *  @package     ImageTiler
 *  @copyright   2015 - present, Ozcan Durak
 *  @license     http://ImageTiler.mit-license.org
 *  @version     CVS: $Id: app.js, v1.0.0 Rev 1 10/08/2015 17:28:43 ssc Exp $
 *  @author      Ozcan Durak <info@ozcandurak.com>
 *  @link        https://github.com/ozcan-durak/ImageTiler
 *  ================================================================================
 *  LICENSE: Permission is hereby granted, free of charge, to any person obtaining
 *  a copy of this software and associated documentation files (the "Software'),
 *  to deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is furnished
 *  to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY
 *  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *  ================================================================================
 */

// Required Modules to run the service
var http = require("http"),
    url  = require('url'),
    im = require("imagemagick"),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    favicon = require('serve-favicon'),
    finalhandler = require('finalhandler');

    //var nodemailer = require('nodemailer'),

var _favicon = favicon(__dirname + '/public/favicon.ico');

// Here we start to create the sever
var server = http.createServer(function(req, res) {

    //to check execution time
    console.time('execution_time');

    // Parsing String from the URL
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var fileP = query.url;
    var fileUrl = String(query.url);

    var output = fileUrl.split('/');
    output.splice(6, 1);
    filePath = output.join('/');

        //explode the URL and gets the clean url to Origin of the image.
        var fileChecker = String(output[4]);

        //send email if the service fails
       /* var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'imagetiler@gmail.com',
                pass: 'xxx'
            }
        });*/

       /* var mailOptions = {
            from: 'Image Tiler Service ✔ <imagetiler@gmail.com>', // sender address
            to: 'ozcan.durak@ankageo.com', // list of receivers
            subject: 'ImageTiler Has failed', // Subject line
            text: 'Check immediately', // plaintext body
            html: '<b>Image cannot be served, Reason might be image not exist ! Please check the requested image on the server to verify</b>' // html body
        };*/

        var imageServe = function() {
            console.log("imageServe");
            fs.readFile(fileP + ".jpg", function (err, content) {
                if (err) {

                    console.log("imageServe if ");
                    res.writeHead(400, {'Content-type': 'text/html'});
                    //res.end("Image cannot be served, Reason might be image not exist ! Please check the requested image on the server to verify");
                    console.log(err);

                } else {

                    console.log("imageServe else ");
                    //specify the content type in the response will be an image
                    res.writeHead(200, {'Content-type': 'image/jpg'});
                    res.end(content);
                }
            });
        }

        //Tiles the image.
        var convertFunct = function(filePath) {

            console.log("convertFunct ");

            if (!fs.existsSync(filePath)){
                console.log("convertFunct if ");


                mkdirp(filePath);
                 console.log("File wasn't exists, so its been created = "+filePath);

                  var args = [
                  filePath+".jpg",
                  "-crop", "256x256",
                  "-strip", "-profile", "profile.icm",
                  "-quality", "90%",
                  "-set",  "filename:tile",
                  filePath+"/%[fx:page.x/256]-%[fx:page.y/256]", "%[filename:tile]-0.jpg"
                  ];

                  // Function to crop
                  im.convert(args, function(err) {
                    imageServe();
                     });

            } else {

                console.log("convertFunct else ");

                imageServe();
            }
        };


    console.log("convertFunct cagirilacak ");

        convertFunct(filePath);

    var done = finalhandler(req, res);

    _favicon(req, res, function onNext(err) {


        res.statusCode = 404;
    });

    Buconsole.log("convertFunct cagirilacak bitti");

    //Check the execution time
    console.timeEnd('execution_time');
}).listen(8080, function(){
  console.log('http://localhost:8080?url=IMAGE_URL_HERE_WITHOUT')
});
