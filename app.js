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
var http = require("http");
var url  = require('url');
var im = require("imagemagick");
var fs = require('fs');
var mkdirp = require('mkdirp');
//var tiler = require('./tiler');

// Here we start to create the sever
var server = http.createServer(function(req, res) {
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

/*console.log("1------>"+fileP); 
console.log("2------>"+fileUrl);
console.log("3------>"+filePath);*/
var fileChecker = String(output[4]);
/*console.log("2------>"+output); 
console.log("4------>"+fileChecker); */

var imageServe = function(){
    fs.readFile(fileP + ".jpg", function (err, content) {
          if (err) {
              res.writeHead(400, {'Content-type':'text/html'})
              console.log(err);
          } else {
              //specify the content type in the response will be an image
              res.writeHead(200,{'Content-type':'image/jpg'});
              res.end(content);
          }
      });  


var convertFunct = function(filePath) {
    if (!fs.existsSync(filePath)){
         mkdirp(filePath);
         console.log("File wasn't exists, so its been created = "+ fileChecker)
         
          var args = [
          filePath+".jpg",                                                                              // image location
          "-crop", "256x256",
          "-strip", "-profile", "profile.icm",                                                          // will crop the tiles
          "-quality", "90%",                                                                            // Tile Size
          "-set",  "filename:tile",             
          filePath+"/%[fx:page.x/256]-%[fx:page.y/256]", "%[filename:tile]-0.jpg"             // {512} value should be same as your tile size.                                       
          ];

          // Function to crop
          im.convert(args, function(err) {
            imageServe();
             });

          //Removes the undefined folder if created by Nodejs bug (related with :51)
        if (fs.existsSync("undefined")) {
          fs.rmdir("undefined");
         };
    } else {
        imageServe();
    }
};

convertFunct(filePath);


console.timeEnd('execution_time');
}).listen(8080, function(){
  console.log('http://localhost:8080?url=IMAGE_URL_HERE');
})
