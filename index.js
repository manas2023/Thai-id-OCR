const express=require('express')
const multer=require('multer')

const tesseract = require("node-tesseract-ocr")

const path=require('path')

const app=express()

app.use(express.static(path.join(__dirname + '/uploads')))
//we are making folders as static

app.set('view engine',"ejs")

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
//set the storage for multer 

const upload=multer({storage:storage})


app.get('/',(req,res)=>{
    res.render('index',{data:''})
})
app.post('/extracttextfromimage',upload.single('file'), (req,res)=>{
    console.log(req.file.path)

    const config = {
        lang: "eng",
        oem: 1,
        psm: 3,
      }
      
      tesseract
        .recognize(req.file.path, config)
        .then((text) => {
        const extractedInfo = extractInformation(text);
        console.log(extractedInfo);
        
          res.render('index',{data:extractedInfo})
        })
        .catch((error) => {
          console.log(error.message)
        })

})

app.listen(5000,()=>{
    console.log("App os listening on port 5000")
})