const exp=require("express")
const app=exp()

app.listen(3500,()=>console.log("Server is running on port 3500...."))
app.use(exp.json());

var cors = require('cors');
app.use(cors())

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://nishanth1107g:tiiEM5S8d6cWNE6m@cluster0.wq1wzoo.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    let dbObj=await client.db("test")
    let todoColl=dbObj.collection('todoCollection');
    //console.log(todoColl.dbName)
    app.set('todoColl',todoColl);
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

const tapp=require('./api')
app.use('/api',tapp)


const errorHandlingMiddleware=(err,req,res,next)=>{
    res.send({message:err});
}
app.use(errorHandlingMiddleware);

const invalidPathMiddleWare=(req,res,next)=>{
    res.send({message:"Invalid Path"});
}
app.use("*",invalidPathMiddleWare);