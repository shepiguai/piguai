const Koa = require('koa');
const router = require('koa-router')();
const cors = require('koa-cors')

const bodyParser = require('koa-bodyparser')
const app = new Koa();
const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')

app.use(bodyParser())

app.use(cors());

const Schema = mongoose.Schema

mongoose.connect(dbConfig.newDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('success');
}).catch((e)=>{
    console.log(e);
})

const niuSchema = new Schema({
    id:{
        type:Number,
        required:true //必须有
    },
    name:{
        type:String,
        required:true
    }
})
const Niu = mongoose.model('niu', niuSchema, 'niu');

router.get('/', function (ctx, next) {
    ctx.body="Hello koa";
})
router.get('/getniu',async (ctx,next)=>{
    const promise = new Promise(((resolve, reject) => {
        Niu.find(function(err,ret){
            if(err){
                resolve('查询失败')
            } else {
                resolve(JSON.stringify(ret))
            }
        })
    }))
    const res = await promise
    ctx.body=JSON.stringify(res)
});

router.post('/addniu',async (ctx,next)=>{
    const {id, name} = ctx.request.body
    const niu = new Niu({
        id,
        name
    })
    const promise = new Promise(((resolve, reject) => {
        niu.save(function(err,ret){
            if(err){
                resolve({message: '保存失败'})
            }
            resolve({message: '保存成功'})
        })
    }))
    ctx.body = await promise;
});

router.delete('/removeniu',async (ctx,next)=>{
    const {id} = ctx.request.body
    console.log(id, 11);
    const promise = new Promise(((resolve, reject) => {
        Niu.deleteMany({ _id: id },function(err,ret){
            if(err){
                resolve({message: '删除成功'})
            }
            resolve({message: '删除成功'})
        })
    }))
    ctx.body = await promise;
});


app.use(router.routes()); //作用：启动路由
app.use(router.allowedMethods());

app.listen(3001);
