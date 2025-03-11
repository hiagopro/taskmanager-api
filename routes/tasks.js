const express = require("express");
const authenticateToken = require("../middlewares/authenthicationToken");
const secret = 'T2NzMFVhVzM4ZW9VdVR5Y3g0a0pXbTFRbGRaZG5mYzZB'
const jwt = require("jsonwebtoken");
const routerTasks = express.Router();
const users = [
    {
        name: 'Jane Spoonfighter',
        user: 'janspoon@fighter.dev',
        password: '123',
        id: 1,
    }
]

const tasks = [{
    task:'adicione um botton na home',
    date:'2025-02-20',
    state: 'pendente',
    deadline: '2025-02-28',
    id:1,
    clientId: 1,
    user: 'user',
},
{
    task:'mude tudp',
    date:'2025-02-30',
    state: 'concluido',
    deadline: '2025-03-14',
    id:2,
}
]
let logedIn = false
routerTasks.post("/tasks", async (req, res)=>{
    const {task, date, state} = req.body;
    tasks.push({
        task:task,
        date:date,
        state:state,
        deadline:deadline,
    })
    return res.status(200)
})
routerTasks.get("/tasks/:userId",authenticateToken, async (req, res)=>{
    const userId = req.params.userId
    const token = req.headers.token
    const decode = jwt.decode(token)
    const tokenId = decode.userId
    if(tokenId = userId){
    return res.status(201).send(tasks)
    }
})
routerTasks.patch("/tasks", async (req, res)=>{
    const {taskId} = req.body;
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
        // Atualize o estado da tarefa diretamente
        tasks[taskIndex].state = 'concluido'; // Atualiza o estado da tarefa

        // Agora a tarefa foi modificada, envie uma resposta indicando sucesso
        return res.status(200).json({ message: 'Task updated successfully', task: tasks[taskIndex] });
    }
})
routerTasks.post("/login", async (req, res)=>{
    try {
        const { user, password } = req.body;
    
        // Assuming `users` is an object or array where you have user data
        const existingUser = users.find(u => u.user === user); // This should match how you store users
    
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

module.exports = routerTasks