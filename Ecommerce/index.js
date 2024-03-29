
const bodyParser=require('body-parser');
const express=require('express');

const dbConnect=require('./config/dbConnect');
const {notFound,errorHandler}=require('./middlewares/errorHandler');
const app=express();
const dotenv=require('dotenv').config();
const PORT=process.env.PORT || 4000;
const productRoute=require('./routes/productRoute');
const authRoute=require('./routes/authRoute');
const cookieParser=require('cookie-parser');
const morgan=require("morgan");

dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());


app.use('/api/user',authRoute);
app.use('/api/product',productRoute);
app.use(notFound);
app.use(errorHandler);
app.get('/', (req, res) => {
    res.send('Welcome to the homepage');
  });
  

  
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
}
);


