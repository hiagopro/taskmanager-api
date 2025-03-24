const express = require("express");
const authenticateToken = require("../middlewares/authenthicationToken");
const getConnection = require("../connect");
const secret = "T2NzMFVhVzM4ZW9VdVR5Y3g0a0pXbTFRbGRaZG5mYzZB";
const jwt = require("jsonwebtoken");
const routerTasks = express.Router();

let logedIn = false;
routerTasks.post("/tasks", authenticateToken, async (req, res) => {
  const userId = req.headers.userId;
  const token = req.headers.token;
  try {
    const decode = jwt.decode(token);
    const tokenId = decode.userId;
    if (tokenId === userId) {
      const { task, date, state } = req.body;
      const deadline = "29/03/2025";
      connection = await getConnection();
      connection.query(
        "SELECT groupId FROM users WHERE id=? ",
        [userId],
        function (err, rows, fields) {
          if (!err) {
            const groupId = rows.groupId;
            connection.query(
              "INSER INTO tasks(task,date,state,deadline,clientId, groupId) values(?,?,?,?,?,?) ",
              [task, date, state, deadline, userId, groupId],
              function (err, rows, fields) {
                if (!err) {
                  const userAcess = rows[0].useracess;
                  if (userAcess === "admin") {
                    return res.status(201).send(true);
                  } else {
                    return res.status(201).send(false);
                  }
                } else {
                  console.log(err);
                }
              }
            );
          } else {
            console.log(err);
          }
        }
      );
    }
  } catch (error) {
    // Se houver erro na verificação do token ou outra falha
    console.error(error);
    return res
      .status(400)
      .json({ message: "Token inválido ou erro na requisição" });
  }
  return res.status(200);
});
routerTasks.get("/tasks/:userId", authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  const token = req.headers.token;
  try {
    const decode = jwt.decode(token);
    const tokenId = decode.userId;

    if (parseInt(tokenId) === parseInt(userId)) {
      const connection = await getConnection();
      connection.query(
        "SELECT * FROM users WHERE id=?",
        [userId],
        function (err, rows, fields) {
          if (!err) {
            const useracess = rows[0].useracess;
            const groupId = rows[0].groupId;

            if (useracess === "admin") {
              connection.query(
                "SELECT * FROM tasks WHERE groupId = ? ",
                [groupId],
                function (err, rows, fields) {
                  if (!err) {
                    return res.status(201).send(rows);
                  } else {
                    console.log(err);
                  }
                }
              );
            } else {
              connection.query(
                "SELECT * FROM tasks WHERE groupId = ? AND clientId =?",
                [groupId, userId],
                function (err, rows, fields) {
                  if (!err) {
                    return res.status(201).send(rows);
                  } else {
                    console.log(err);
                  }
                }
              );
            }
          }
        }
      );
    } else {
      return res.status(401).json("Nao autorizado");
    }
  } catch (error) {
    // Se houver erro na verificação do token ou outra falha
    console.error(error);
    return res
      .status(400)
      .json({ message: "Token inválido ou erro na requisição" });
  }
});
routerTasks.patch("/tasks", authenticateToken, async (req, res) => {
  const userId = req.headers.userid;
  const token = req.headers.token;

  try {
    const decode = jwt.decode(token);
    const tokenId = decode.userId;
    const { taskId } = req.body;
    if (String(tokenId) === String(userId)) {
      const connection = await getConnection();
      connection.query(
        "SELECT * FROM users WHERE id=? ",
        [userId],
        function (err, rows, fields) {
          if (!err) {
            const userAcess = rows[0].useracess;
            const clientId = rows[0].id;

            if (
              userAcess === "admin" ||
              parseInt(clientId) === parseInt(userId)
            ) {
              connection.query(
                "UPDATE tasks SET state= ? WHERE id=?",
                ["concluido", taskId],
                function (err, rows, fields) {
                  if (!err) {
                    return res.status(201).send("Concluid");
                  } else {
                    console.log(err);
                  }
                }
              ); // Atualiza o estado da tarefa
            } else {
              console.debug({ clientId, userId });
              return res.status(400).send("you cant do this");
            }
          } else {
            console.log(err);
          }
        }
      );

      // Atualize o estado da tarefa diretamente
    }
  } catch (error) {
    // Se houver erro na verificação do token ou outra falha
    console.error(error);
    return res
      .status(400)
      .json({ message: "Token inválido ou erro na requisição" });
  }
});
routerTasks.post("/login", async (req, res) => {
  try {
    const { user, password } = req.body;

    const connection = await getConnection();
    connection.query(
      "SELECT * FROM users WHERE user =?  ",
      [user],
      function (err, rows, fields) {
        if (!err) {
          const passwordReal = rows[0].password;
          // Check if the password matches
          if (password === passwordReal) {
            const userId = rows[0].id;
            logedIn = true;
            const token = jwt.sign({ userId }, secret, {
              expiresIn: 84600,
            });
            const data = {
              token: token,
              userId: userId,
            };
            return res.status(201).send(data);
          } else {
            console.log(passwordReal, password, user, rows);
            return res.status(400).send("Password is incorrect");
          }
        } else {
          if (!existingUser) {
            return res.status(400).send("User not found");
          }
          console.log(err);
        }
      }
    );
    // If the user doesn't exist, return an error
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
});
routerTasks.get("/logedin", async (req, res) => {
  return res.status(201).send(logedIn);
});
routerTasks.get("/getnameuser", authenticateToken, async (req, res) => {
  const userId = req.headers.userid;
  const token = req.headers.token;
  try {
    const decode = jwt.decode(token);
    const tokenId = decode.userId;
    console.debug("ids", tokenId, userId);
    if (parseInt(tokenId) === parseInt(userId)) {
      const connection = await getConnection();
      connection.query(
        "SELECT name FROM users WHERE id = ? ",
        [userId],
        function (err, rows, fields) {
          if (!err) {
            return res.status(201).send(rows[0].name);
          } else {
            console.log(err);
          }
        }
      );
    } else {
      return res.status(401).json("Nao autorizado");
    }
  } catch (error) {
    // Se houver erro na verificação do token ou outra falha
    console.error(error);
    return res
      .status(400)
      .json({ message: "Token inválido ou erro na requisição" });
  }
});
routerTasks.get("/users", authenticateToken, async (req, res) => {
  const userId = req.headers.userid;
  const token = req.headers.token;
  try {
    const decode = jwt.decode(token);
    const tokenId = decode.userId;
    if (parseInt(tokenId) === parseInt(userId)) {
      connection = await getConnection();
      connection.query(
        "SELECT useracess,groupId FROM users WHERE id =?  ",
        [userId],
        function (err, rows, fields) {
          if (!err) {
            const userAcess = rows[0].useracess;
            const groupId = rows[0].groupId;
            if (userAcess === "admin") {
              connection.query(
                "SELECT name,user,id,useracess FROM users WHERE groupId =? ",
                [groupId],
                function (err, rows, fields) {
                  if (!err) {
                    res.status(201).send(rows);
                  } else {
                    console.log(err);
                  }
                }
              );
            } else {
              return res.status(401).send("Nao autorizado pea listar usuarios");
            }
          } else {
            console.log(err);
          }
        }
      );
    } else {
      return res.status(401).json("Nao autorizado");
    }
  } catch (error) {
    // Se houver erro na verificação do token ou outra falha
    console.error(error);
    return res
      .status(400)
      .json({ message: "Token inválido ou erro na requisição" });
  }
});
routerTasks.get("/adminacess", async (req, res) => {
  const userId = req.headers.userid;
  const token = req.headers.token;
  try {
    const decode = jwt.decode(token);
    const tokenId = decode.userId;
    if (parseInt(tokenId) === parseInt(userId)) {
      connection = await getConnection();
      connection.query(
        "SELECT useracess FROM users WHERE id =?  ",
        [userId],
        function (err, rows, fields) {
          if (!err) {
            const userAcess = rows[0].useracess;
            if (userAcess === "admin") {
              return res.status(201).send(true);
            } else {
              return res.status(201).send(false);
            }
          } else {
            console.log(err);
          }
        }
      );
    } else {
      console.debug(tokenId, userId);
      return res.status(401).json("Nao autorizado");
    }
  } catch (error) {
    // Se houver erro na verificação do token ou outra falha
    console.error(error);
    return res
      .status(400)
      .json({ message: "Token inválido ou erro na requisição" });
  }
});
routerTasks.post("/adduser", authenticateToken, async (req, res) => {
  const userSessionId = req.headers.userid;
  const token = req.headers.token;
  const username = req.body.username;
  const useremail = req.body.useremail;
  const userrole = req.body.userrole;
  const password = req.body.password;

  try {
    const decode = jwt.decode(token);
    const tokenId = decode.userId;

    if (parseInt(tokenId) === parseInt(userSessionId)) {
      const connection = await getConnection();
      connection.query(
        "SELECT * FROM users WHERE id=? ",
        [tokenId],
        function (err, rows, fields) {
          if (!err) {
            const useracess = rows[0].useracess;
            const userGroupId = rows[0].groupId;
            if (useracess === "admin") {
              connection.query(
                "INSERT INTO users(name,user,password,useracess,groupId) values (?,?,?,?,?) ",
                [username, useremail, password, userrole, userGroupId],
                function (err, rows, fields) {
                  if (!err) {
                    console.log("added sucessly");
                    res.status(201).send("has been added");
                  } else {
                    console.log(err);
                  }
                }
              );
            }
          } else {
            console.log(err);
          }
        }
      );
    } else {
      return res.status(401).json("Nao autorizado");
    }
  } catch (error) {
    // Se houver erro na verificação do token ou outra falha
    console.error(error);
    return res
      .status(400)
      .json({ message: "Token inválido ou erro na requisição" });
  }
});
routerTasks.post("/addtask", authenticateToken, async (req, res) => {
  const userSessionId = req.headers.userid;
  const token = req.headers.token;
  const task = req.body.task;
  const deadline = req.body.deadline;
  const clientId = req.body.clientId;

  try {
    const decode = jwt.decode(token);
    const tokenId = decode.userId;

    if (parseInt(tokenId) === parseInt(userSessionId)) {
      const connection = await getConnection();
      connection.query(
        "SELECT * FROM users WHERE id=? ",
        [userSessionId],
        function (err, rows, fields) {
          if (!err) {
            const useracess = rows[0].useracess;
            const userGroupId = rows[0].groupId;

            if (useracess === "admin") {
              const date = "19-03-2025";
              const state = "pendente";
              connection.query(
                "INSERT INTO tasks(task,date,state,deadline,clientId,groupId) values (?,?,?,?,?,?) ",
                [task, date, state, deadline, clientId, userGroupId],
                function (err, rows, fields) {
                  if (!err) {
                    console.log("added sucessly");
                    res.status(201).send("has been added");
                  } else {
                    console.log(err);
                  }
                }
              );
            } else {
              return res.status(401).send("Naoo autorizado");
            }
          } else {
            console.log(err);
          }
        }
      );
    } else {
      return res.status(401).json("Naooo autorizado");
    }
  } catch (error) {
    // Se houver erro na verificação do token ou outra falha
    console.error(error);
    return res
      .status(400)
      .json({ message: "Token inválido ou erro na requisição" });
  }
});

module.exports = routerTasks;
