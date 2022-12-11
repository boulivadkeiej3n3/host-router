const HTTP   = require("http");
const Axios  = require("axios");
const Mongoose = require("mongoose");

const ServersDB = Mongoose.model(`RenderServers`, new Mongoose.Schema({url:String}));
let ServersList =[];

/*     INITIALIZE THE SERVER     */
(async function  (){
    Mongoose.connect(`mongodb+srv://maximous:123MONGODB.com@m001.cmsqx.mongodb.net/?retryWrites=true&w=majority`).then((connection)=>{
        connection ? console.log(`Database Connected!`): console.log(`Error Occured during connection to database`);
    });
         (await ServersDB.find({url:{$regex:/.+/}},{__v:0,_id:0})).forEach((serverURL)=>{
            ServersList.push(serverURL.url);
         });
        console.log(ServersList)

    setInterval((req,res)=>{
        try{
        Axios.get(`https://get-ping-host.onrender.com/`, {headers: { "Accept-Encoding": "gzip,deflate,compress" } });
        }catch(e){console.log(e.message)}
    },(5*60000))
})();
/********************** **/
async function Router(req, res){
     console.log(`REQUEST RECEIVED`);
    let serverURL = req.url.match(/(?<=\/getPing\/).+/);
    console.log(serverURL)
    if(!serverURL){res.end(`server is awake`);return 0;}else{serverURL = serverURL[0]}
   //Add the newely created to the local database and return back the previosu and the next index:
   (ServersList.indexOf(serverURL) <0 )?ServersList.push(serverURL):0;
   let previousServer = (ServersList.indexOf(serverURL) -1 >= 0)? ServersList[ServersList.indexOf(serverURL) -1]:ServersList[ServersList.indexOf(serverURL)]
           previousServer=  previousServer.replace("onrender.com",".onrender.com");
   console.log(`Previous Server: `+previousServer);
   res.end (JSON.stringify({previousServer}));

 
}

HTTP.createServer(Router).listen(process.env.PORT,()=>console.log(`Server is listening`))
