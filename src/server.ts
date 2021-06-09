import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  
 // filter Image endpoint
 // Filter an image from a public url and returns the filtered image file to the user
  app.get( "/filteredimage", async (req:express.Request, res:express.Response) => {
  const image_url: string = req.query.image_url;

  if ( !image_url ) {
    return res.status(400)
              .send(`image url is required`);
  }

  const filtered_path: string = await filterImageFromURL(image_url);
  res.status(200).sendFile(filtered_path, () => {
    
     let files: Array<string> = [filtered_path];
     deleteLocalFiles(files); 
    });
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (sreq:express.Request, res:express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();