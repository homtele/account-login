const express = require('express')
const engine = require('express-handlebars').engine
const users = [
  {
    firstName: 'Tony',
    email: 'tony@stark.com',
    password: 'iamironman'
  },
  {
    firstName: 'Steve',
    email: 'captain@hotmail.com',
    password: 'icandothisallday'
  },
  {
    firstName: 'Peter',
    email: 'peter@parker.com',
    password: 'enajyram'
  },
  {
    firstName: 'Natasha',
    email: 'natasha@gamil.com',
    password: '*parol#@$!'
  },
  {
    firstName: 'Nick',
    email: 'nick@shield.com',
    password: 'password'
  }
]
const sessions = {
  getRandom: () => {
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let random = ''
    for (let i = 0; i < 5; i++) {
      random += pool[Math.floor(Math.random() * pool.length)]
    }
    return random
  },
  getSessionID: (cookie) => {
    return cookie.slice(10, 15)
  }
}

const PORT = 3000

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  const cookie = req.headers.cookie
  if (cookie) {
    const sessionID = sessions.getSessionID(cookie)
    const firstName = sessions[sessionID].firstName
    res.render('index', { firstName })
  } else {
    res.redirect('/login')
  }
})

app.get('/login', (req, res) => {
  const cookie = req.headers.cookie
  if (cookie) {
    res.redirect('/')
  } else {
    res.render('login')
  }
})

app.get('/logout', (req, res) => {
  const cookie = req.headers.cookie
  if (cookie) {
    const sessionID = sessions.getSessionID(cookie)
    delete sessions[sessionID]
    res.clearCookie('sessionID')
    res.redirect('/login')
  } else {
    res.redirect('/login')
  }
})

app.post('/login', (req, res) => {
  const user = users.filter(user => user.email === req.body.email).find(user => user.password === req.body.password)
  if (user) {
    const firstName = user.firstName
    const sessionID = sessions.getRandom()
    sessions[sessionID] = { firstName }
    res.cookie('sessionID', sessionID)
    res.redirect('/')
  } else {
    res.redirect('/login')
  }
})

app.listen(PORT, () => {
  console.log(`The server is listening on http://localhost:${PORT}`)
})
