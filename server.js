const express = require('express');
const app = express();
const PORT = 4000;





//Listener
app.listen(PORT, () => console.log(`Listening for client requests on port ${PORT}`));