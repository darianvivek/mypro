const exp=require("express")
const tapp=exp.Router();

tapp.use(exp.json());

tapp.post('/add-todo',async(req,res)=>{
    //res.send({message:req.body.body});
    const todoColl=req.app.get('todoColl');
    let temp=req.body;
    await todoColl.insertOne(temp);
    res.status(200).send({message:'todo added successfully'})
})

tapp.get('/get-todos',async(req,res)=>{
    const todoColl=req.app.get('todoColl');
    //res.send({message:req.body});
    let todosList=await todoColl.find().toArray();
    console.log(todosList);
    res.status(200).send({payload:todosList});
})

tapp.put('/edit-todo',async(req,res)=>{
    const todoColl=req.app.get('todoColl');
    let newTodo=req.body;
    let todo=await todoColl.updateOne({id:newTodo.id},{$set:{...newTodo}});
    res.status(200).send({message:'edited todo'});
})

tapp.get('/get-todo/:id',async(req,res)=>{
    const todoColl=req.app.get('todoColl');
    let todoId=(+req.params.id);
    let todo=await todoColl.findOne({id:todoId});
    res.status(200).send({message:'sent todo',payload:todo});
})

tapp.delete('/delete-all',async(req,res)=>{
    const todoColl=req.app.get('todoColl');
    todoColl.deleteMany();
    res.status(200).send({message:'deleted all'});
})

tapp.delete('/delete-todo/:id',async(req,res)=>{
    const todoColl=req.app.get('todoColl');
    let todoId=(+req.params.id);
    let todo=await todoColl.deleteOne({id:todoId});
    res.status(200).send({message:`deleted todo`});
})

module.exports=tapp