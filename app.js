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
 *    The above copyright notice and this permission notice shall be included in all
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

// Here we start to create the sever
var server = http.createServer(function(req, res) {
// Parsing String from the URL
var url_parts = url.parse(req.url, true);
var query = url_parts.query;

res.end(query.url+"/pano-0-0-0.jpg");
if (!fs.existsSync(query.url+"/pano-0-0-0.jpg")){

// To check if the file exists
var fileChecker = query.url;
if (!fs.existsSync(fileChecker)){
    fs.mkdirSync(fileChecker);
}

// Arguments to Call
var args = [
  query.url+".jpg",                                             // image location
  "-crop",                                                      // will crop the tiles
  "512x512",                                                    // Tile Size
  "-set",             
  "filename:tile",
  query.url+"/pano-%[fx:page.x/512]-%[fx:page.y/512]",          // {512} value should be same as your tile size. 
  "%[filename:tile]-0.jpg"                                      
];

// Function to crop
im.convert(args, function(err) {
    if(err) { throw err; }
    res.end("Image crop complete");
  });

}

 /*Pictures will be suppliead in JSON 
 This part is a TODO.*/

console.log(query); //{Object}
  res.end("End");

}).listen(8080, function(){
  console.log('http://localhost:8080?url=pano');
})
