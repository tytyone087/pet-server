const express=require("express");
const cors=require("cors");
const app=express();
const models=require('./models');
const multer= require("multer");
const upload=multer({
    storage:multer.diskStorage({
        destination:function(req, file, cb){
            cb(null, "uploads/") 
        },
        filename:function(req, file, cb){
            cb(null, file.originalname)
        }
    })
})
var port="8080" //사용할 서버 포트


app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"))
//서버생성(request: 요청 , responsive: 응답)
app.get('/products', (req, res) =>{
    models.Product.findAll({
        order:[
            ['createdAt', 'DESC']
            //ASC:오름차순, DESC:내림차순
        ],
        attributes:["id","name","description","price","seller","createdAt","imageUrl"],
    })
    .then((result)=>{
        console.log("PRODUCT : ", result);
        res.send({
            product:result,
        })
    })
    .catch((error)=>{
        console.error(error);
        res.status(400).send("에러발생")
    })
})
app.get('/products/:id', (req, res) => {
    const params=req.params;
    const {id} = params;
    models.Product.findOne({
        where: {
            id:id,
        }
    })
    .then((result)=>{
        console.log("product:", result);
        res.send({
            product: result
        })
    })
    .catch((error)=>{
        console.error(error);
        res.status(400).send('상품조회시 에러가 발생했습니다.')
    })
})
app.post('/products', (req, res) =>{
    const body=req.body;
    const {name, price, seller, description, imageUrl} =body;
    if(!name || !price || !seller || !description || !imageUrl){
        res.send('모든 필드를 입력해주세요')
    }

    models.Product.create({
        name,
        description,
        price,
        seller,
        imageUrl,

    })
    .then((result)=>{
        console.log('상품생성결과:', result);
        res.send({result,})
    })
    .catch((error)=>{
        console.error(error)
        res.status(400).send('상품 업로드에 문제가 발생했습니다.')
    })
    
})
app.post('/image', upload.single('image'), (req, res) =>{
    const file=req.file;
    console.log(file)
    res.send({
       imageurl:file.path, 
    })
})

app.listen(port, () =>{
    console.log('펫 서버가 돌아가고 있습니다. ')
    models.sequelize.sync()
    .then(()=>{
        console.log('DB연결 성공')
    })
    .catch((err)=>{
        console.log(err);
        console.log('DB연결 에러')
        process.exit();
    })
})