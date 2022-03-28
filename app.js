const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./routes/index');
const cors = require('cors');
const socket = require('socket.io');
const app = express();
dotenv.config();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
	next();
});

app.use(cors())
app.use(bodyParser.json({limit: '20000kb'}));
app.use('/uploads', express.static('uploads')); // Makes Upload Folder Available Publically
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Databse Connection
mongoose
	.connect(process.env.DATABASE_URL, {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log('Database Connected !');
	})
	.catch((err) => {
		console.log('Error at Database Connection !', err);
		process.exit();
	});

// define a simple route
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to E-Store.' });
});

app.use('/', routes);

const PORT = 3001;
const server = app.listen(PORT, () => {
	console.log('Server is running on PORT: ' + PORT);
});

const io = socket(server,{
	cors:{
		origin:"http://localhost:3000",
		methods:["GET","POST"],
	}
})

io.on("connection",(socket)=>{

    socket.on("join_room", (data) => {
		socket.join(data);
		console.log(`User with ID: ${socket.id} joined room: ${data}`);
	  });

	  socket.on("new_product", (data) => {
		socket.to(data.room).emit("message_count", {count:1});
	  });
	  
	socket.on("send_message", (data) => {
		socket.to(data.room).emit("receive_message", data);
		socket.to(data.room).emit("message_count", {count:1});
	  });

	socket.on('disconnect',()=>{
		console.log("disconnect user",socket.id)
	})
})


