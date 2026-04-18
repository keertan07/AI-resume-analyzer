const  express=require('express')// brnging the express module to create a server and handle routes,
const cors=require('cors')// bringing the cors module to handle cross-origin requests from the frontend, allowing the frontend to communicate with the backend without issues.
const app=express()//express() creates an actual server. Think of it like — express is a factory, and calling express() produces one server from that factory. We store that server in app. Everything from here on is us configuring that server.
app.use(cors())//Remember cors? Here's what it does — by default, browsers block your frontend from talking to a backend on a different address. So when React (on port 3000) tries to call your server (on port 5000), the browser says "nope, different address, blocked." Cors removes that block. app.use() means "apply this to every single request that comes in."
app.use(express.json())//When your frontend sends data to the backend — like a resume text — it sends it as JSON. This line tells the server "understand JSON when it arrives." Without this, your server receives the data but can't read it. Like receiving a letter but not being able to open the envelope.
app.get('/',(req,res)=>{
    res.send('Backend is running')
})
/*
app.get — listen for a GET request. A GET request means "someone is visiting a URL to fetch something." When you type a URL in browser and hit enter — that's a GET request.
'/' — this is the address. / means the homepage. Like google.com/ — that / at the end is the homepage route.
(req, res) => — this is a function that runs when someone visits /. It receives two things automatically: req (what the visitor sent — their request) and res (what you send back — your response).
res.send('Backend is running!') — send back this text as the response. This is exactly what appeared in your browser.
So the whole thing means: "When someone visits the homepage, run this function, and send back the text 'Backend is running'."
*/

app.listen(5000,()=>{
    console.log('Server is running on port 5000')
})
/*
app.listen(5000) — start the server and keep it running, watching for visitors on port 5000. A port is like a door number on a building. Your computer has thousands of doors. You told your server to stand at door number 5000 and wait.
When it successfully starts, the function inside runs and prints "Server started on port 5000" — which is what you saw in the terminal.
*/