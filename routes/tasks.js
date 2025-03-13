const express = require("express");
const authenticateToken = require("../middlewares/authenthicationToken");
const secret = 'T2NzMFVhVzM4ZW9VdVR5Y3g0a0pXbTFRbGRaZG5mYzZB'
const jwt = require("jsonwebtoken");
const routerTasks = express.Router();
const users = [
    
    {
        name: 'Hiago gentil',
        user: 'areazica@gmail.com',
        password: '123',
        id: '2',
        useracess: 'admin',
    },
    {
        name: 'USUARIO COMUN',
        user: 'user@gmail.com',
        password: '123',
        id: '1',
        useracess: 'user',
    }

]

const tasks = [{
    task:'adicione um botton na home',
    date:'2025-02-20',
    state: 'pendente',
    deadline: '2025-02-28',
    id:1,
    clientId: 1,
    
},
{
    task:'mude tudp',
    date:'2025-02-30',
    state: 'concluido',
    deadline: '2025-03-14',
    id:2,
    clientId: 1,
    
}
]
let logedIn = false
routerTasks.post("/tasks",authenticateToken, async (req, res)=>{
    const userId = req.headers.userId
    const token = req.headers.token
    try{
        const decode = jwt.decode(token)
        const tokenId = decode.userId
        if(tokenId === userId){
    const {task, date, state} = req.body;
    tasks.push({
        task:task,
        date:date,
        state:state,
        deadline:deadline,
    })}}catch (error) {
        // Se houver erro na verificação do token ou outra falha
        console.error(error);
        return res.status(400).json({ message: "Token inválido ou erro na requisição" });
    }
    return res.status(200)
})
routerTasks.get("/tasks/:userId",authenticateToken, async (req, res)=>{
    const userId = req.params.userId
    const token = req.headers.token
    try{
    const decode = jwt.decode(token)
    const tokenId = decode.userId
   
    if(tokenId === userId){
        const userTasks = tasks.filter((task) => String(task.clientId) === String(userId));
        const user = users.filter((user) => String(user.id) === String(userId));
        const useracess = user[0].useracess;
        console.debug(useracess)
        if(useracess=== 'admin'){
            
            return res.status(201).send(tasks)
            
        }else{
             return res.status(201).send(userTasks)
        }
        
    }else{
        return res.status(401).json('Nao autorizado')
    }}catch (error) {
        // Se houver erro na verificação do token ou outra falha
        console.error(error);
        return res.status(400).json({ message: "Token inválido ou erro na requisição" });
    }
})
routerTasks.patch("/tasks",authenticateToken, async (req, res)=>{
    const userId = req.headers.userid
    const token = req.headers.token
    
    try{
        const decode = jwt.decode(token)
        const tokenId = decode.userId
        
        if(String(tokenId) === String(userId)){
            
        const {taskId} = req.body;
         const taskIndex = tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
         // Atualize o estado da tarefa diretamente
         const user = users.filter((user) => String(user.id) === String(userId));
         const userAcess = user[0].useracess
         const task = tasks.filter((task)=>task.clientId === userId )
         const clientId = task.clientId
            console.log(userId)
         if(userAcess === 'admin' ||clientId === userId ){
         tasks[taskIndex].state = 'concluido'; // Atualiza o estado da tarefa
         }else{
            res.status(400).send('you cant do this')
         }
        
       
        return res.status(200).json({ message: 'Task updated successfully', task: tasks[taskIndex] });
    }}}catch (error) {
        // Se houver erro na verificação do token ou outra falha
        console.error(error);
        return res.status(400).json({ message: "Token inválido ou erro na requisição" });
    }
})
routerTasks.post("/login", async (req, res)=>{
    try {
        const { user, password } = req.body;
    
        // Assuming `users` is an object or array where you have user data
        const existingUser = users.find(u => u.user === user); // This should match how you store users
        console.log(existingUser, user, password)
        // If the user doesn't exist, return an error
        if (!existingUser) {
          return res.status(400).send('User not found');
        }
        const passwordReal = existingUser.password
        // Check if the password matches
        if (password === passwordReal) {
            const userId = existingUser.id
            logedIn = true 
            const token = jwt.sign({userId}, secret,{
                expiresIn: 84600,
            })
            const data = {
                token:token,
                userId:userId,
            }
            return res.status(201).send(data);
        } else {
            console.log(passwordReal,password)
          return res.status(400).send('Password is incorrect');
        }
      } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
      }
})
routerTasks.get("/logedin", async (req,res)=>{
    return res.status(201).send(logedIn)

})
routerTasks.get("/getnameuser",authenticateToken, async (req, res)=>{
    const userId = req.headers.userid
    const token = req.headers.token
    try{
    const decode = jwt.decode(token)
    const tokenId = decode.userId
    console.debug(tokenId, userId)
    if(tokenId === userId){
        const user = users.filter((user) => String(user.id) === String(userId));
        const userName = user[0].name
        const userAcess = user[0].useracess
       
        return res.status(201).send(userName)
    }else{
        return res.status(401).json('Nao autorizado')
    }}catch (error) {
        // Se houver erro na verificação do token ou outra falha
        console.error(error);
        return res.status(400).json({ message: "Token inválido ou erro na requisição" });
    }
})
routerTasks.get("/users",authenticateToken, async (req, res)=>{
    const userId = req.headers.userid
    const token = req.headers.token
    try{
    const decode = jwt.decode(token)
    const tokenId = decode.userId
    if(tokenId === userId){
        const user = users.filter((user) => String(user.id) === String(userId));
        const userAcess= user[0].useracess
        if(userAcess === 'admin'){
            return res.status(201).send(users)
        }else{
            return res.status(402).send('Nao e admin')
        }
        
    }else{
        return res.status(401).json('Nao autorizado')
    }}catch (error) {
        // Se houver erro na verificação do token ou outra falha
        console.error(error);
        return res.status(400).json({ message: "Token inválido ou erro na requisição" });
    }
})
routerTasks.get("/adminacess", async (req,res)=>{
    
    const userId = req.headers.userid
    const token = req.headers.token
    try{
    const decode = jwt.decode(token)
    const tokenId = decode.userId
    if(tokenId === userId){
        const user = users.filter((user) => String(user.id) === String(userId));
        const userAcess= user[0].useracess
        if(userAcess === 'admin'){
            console.log(userAcess,'oiiii')
            return res.status(201).send(true)
        }else{
            return res.status(201).send(false)
        }
        
    }else{
        return res.status(401).json('Nao autorizado')
    }}catch (error) {
        // Se houver erro na verificação do token ou outra falha
        console.error(error);
        return res.status(400).json({ message: "Token inválido ou erro na requisição" });
    }
})


module.exports = routerTasks