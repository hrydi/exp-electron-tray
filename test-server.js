const { app, server } = require('./src/server')

server.listen(app.get('Port'), app.get('Host'), () => console.log('Server running!'))