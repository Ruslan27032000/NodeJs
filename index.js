const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const User = require('./models/user')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(async (req, res, next) => {
    try {
        req.user = await User.findById('604b3d4c767b655884ca85ce')
        next()
    } catch (e) {
        console.log(e)
    }
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)


const PORT = process.env.PORT || 3000


async function start() {
    try {
        const URL = `mongodb+srv://ruslan:gPZ5wolkBczlfqTk@cluster0.aimfc.mongodb.net/shop`
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'ruslan27032000@gmail.com',
                name: 'Ruslan',
                cart: {items: []}
            })
            await user.save()
        }


        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
