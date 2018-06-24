var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://heejin:1234@cluster0-m4ldw.mongodb.net/test?retryWrites=true';
var ObjectID = require('mongodb').ObjectID;

var db;

MongoClient.connect(url, function (err, database) {
   if (err) {
      console.error('MongoDB 연결 실패', err);
      return;
   }
   const collection = database.db("dept");
   db = collection;
});

class DeptModel {
   insertData(){
       return db.collection('depts').insertMany([
        {
            number:2,
            name: "벤",
            join:"2016-1-03",
            partName:"marketing",
            position:"assistant",
            vacation:28,
            status:'Retirement',
            gender:'man',
            score:85			
        },
        {
            
            number:3,
            name: "톰",
            join:"2009-5-13",
            partName:"personnel",
            position:"Manager",
            vacation:28,
            status:'Retirement',
            gender:'woman',
            score:55	
        },
        {
            
            number:4,
            name:"제니퍼",
            join:"2010-8-10",
            partName:"personnel",
            position:"president",
            vacation:28,
            status:'office',
            gender:'woman',
            score:10			
        },
        {
            
            number:5,
            name:"크리스탈",
            join:"2017-6-22",
            partName:"payroll",
            position:"clerk",
            vacation:28,
            status:'office',
            gender:'woman',
            score:33		
        }
       ])
   }
   getDeptList(callback) {
      // 콜백 기반
      // return db.collection('movies').find({}).toArray((err, docs) => {
      //    if ( err ) {
      //       return callback(err);
      //    }

      //    callback(null, docs);
      // });      

      // 프라미스 기반
      // return new Promise( (resolve, reject) => {
      //    db.collection('movies').find({}).toArray()
      //    .then( result => {
      //       resolve(result);
      //    })
      //    .catch( error => {
      //       reject(error);
      //    });
      // });       

      // 프라미스 기반2
      return db.collection('depts').find({}).toArray()
   }

   getDeptDetail(num) {
      return db.collection('depts').findOne({number : num})
   }

   addDept(name, join, partName, position, gender) {
       
       var t1 = new Date();
       var join2;
       var nowYear = t1.getFullYear();
       var nowMonth = t1.getMonth() + 1;
       var nowDay = t1.getDate();

       if(join == null){
           join2 = nowYear+'-'+nowMonth+'-'+nowDay;
       }
       else{
           join2 = join;
       }
       let num;
       db.collection('depts').count( (err, result) =>{
            if(err){
                console.log(err);
            }
            num = result + 1;
            //for(var i=0; i<=result; i++){
                  db.collection('depts').find({number:num}).toArray((err, resulta) =>{
                        if(err){
                            console.log('count error',err);
                        }
                        for(var j=0; j<resulta.length; j++){
                            var v = resulta[j];
                            if(num == v['number']){
                                num += 1;
                            }
                            
                        }
                        return db.collection('depts').insertOne({number : num, name : name, join : join2,
                            partName : partName, position : position, vacation : 28, status : 'office', gender : gender, score : 0 })
                        
                        
                   })
         //   }
            
                
        }); 
   }
   deleteDept(num){
       return db.collection('depts').deleteOne({number:num});

   }

   editDept(num, name, join, partName, position, vacation, gender){
    let array = [name, join, partName, position, vacation, gender];
    const key = ['name', 'join', 'partName', 'position', 'vacation', 'gender'];
    db.collection('depts').find({number:num}).toArray((err, values) => {
        for(var j=0; j<values.length; j++){
            var v = values[j];
            if(isNaN(array[4])){
                array[4] = v[key[4]];
            }
            for(var i=0; i<key.length; i++){
                //console.log(isNaN(data[3]));
                //boolean a = ture;
                if(array[i] == null ){
                    array[i] = v[key[i]];
                }
            }
            
        }
        return db.collection('depts').update({number : num}, {$set:{name : array[0], join : array[1], partName : array[2],
                                            position : array[3], vacation : array[4], gender : array[5] }})
    })
   }

   getScoreList(){
        return db.collection('depts').find().sort({score:-1}).toArray();
   }

   getpartList(part){
        return db.collection('depts').find({partName:part}).toArray();
   }

   toVacation(num, vacation){
        let number = num;
        let vacationV = vacation;
        let hap;
        let temp;
        db.collection('depts').find({number:num}).toArray((err, result) =>{
            
            //console.log(number, vacation);
            for(var j=0; j<result.length; j++){
                var v = result[j];
                temp = v['vacation'];
                hap = temp - vacationV;
                
            }
            return db.collection('depts').update({number:number}, {$set:{vacation : hap}})
        })
    }
}

module.exports = new DeptModel()