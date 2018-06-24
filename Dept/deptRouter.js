var express = require('express');
var fs = require('fs');

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://heejin:1234@cluster0-m4ldw.mongodb.net/test?retryWrites=true';
const deptModel = require('./deptModel');
var db;

MongoClient.connect(url, function (err, database) {
   if (err) {
      console.error('MongoDB 연결 실패', err);
      return;
   }
   const collection = database.db("dept");
   db = collection;
});

// 라우터 얻기
var router=express.Router();

router.route('/depts')
	.get(showDeptList)
	.post(addDept);

router.route('/depts/:num')
	.get(showDeptDetail)
	.delete(deleteDept)
	.put(editDept);	
	
router.route('/score')
	.get(scoreList);	
	
router.route('/vacation/:num/:vacation')
	.post(toVacation);

router.route('/part/:part')
	.get(partList);

router.route('/insert')
	.get(insertData);

module.exports = router;
function insertData(req,res,next){
	try {
		let result =  deptModel.insertData();
		res.send({msg:'데이터 삽입 완료'});
	}
	catch ( error ) {
		next(error);
	}	
}

function scoreList(req, res, next) {

	deptModel.getScoreList().then( results => {
		let resObj = {
			count: results.length,
			data: results
		}		
		res.send(resObj);
	}).catch( error => {
		console.log('error : ', error);
		next(error);
	});
}

// 전체 도큐먼트 목록 얻기
function showDeptList(req, res, next) {

	deptModel.getDeptList().then( results => {
		let resObj = {
			count: results.length,
			data: results
		}		
		res.send(resObj);
	}).catch( error => {
		console.log('error : ', error);
		next(error);
	});
}

async function showDeptDetail(req, res, next) {
	let num = parseInt(req.params.num);
	try {
		console.log(num);
		let result = await deptModel.getDeptDetail(num);
		res.send(result);
	}
	catch ( error ) {
		next(error);
	}	
}

 function addDept(req, res, next) {
	const name = req.body.name;
	
    if (!name) {
        res.status(400).send({error:'사원 이름을 입력하세요'});
        return;
	}
    
    let join = req.body.join;
	let partName = req.body.partName;
	let position = req.body.position;
	let gender = req.body.gender;

    try {
        const result =  deptModel.addDept(name, join, partName, position, gender);
		res.send({name : name, msg :  '님의 사원 추가가 완료되었습니다'});
    }
    catch ( error ) {
		next(error);
		console.log('error', error);
    }
   }


async function deleteDept(req, res) {
	const num = parseInt(req.params.num);
	try {
		let result = await deptModel.deleteDept(num);
		res.send({msg:'사원의 정보가 삭제되었습니다'});
	}
	catch ( error ) {
		next(error);
	}
}

 
async function editDept(req, res) {
	let num = parseInt(req.params.num);
	let name = req.body.name;
	let join = req.body.join;
	let partName = req.body.partName;
	let position = req.body.position;
	let vacation = parseInt(req.body.vacation);
	let gender = req.body.gender;

	try {
        const result = await deptModel.editDept(num, name, join, partName, position, vacation, gender);
		res.send({name : name, msg:'정보 수정 완료' });
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

 function toVacation(req, res) {
	let num = parseInt(req.params.num);
	let vacation = parseInt(req.params.vacation);
	let value;
	
	try {
		db.collection('depts').find({number:num}).toArray((err, result) =>{
	
			for(var j=0; j<result.length; j++){
				var v = result[j];
				temp = v['vacation'];
				
				if(temp < vacation){
					value = 0;
				}
				else{
					value= 1;
				}
				console.log(value);	
			}
			if(value==1){
				const result =  deptModel.toVacation(num, vacation);
				res.send({msg:'휴가 처리가 완료되었습니다' });  
			}
			else{
				res.send({msg:'남은 휴가 일수가 부족합니다.' });  
			}
		})
		//console.log(value);
		
    }
    catch ( error ) {
		console.log('error : ', error);
		next(error);
    }
}
function partList(req, res, next) {
	let part = req.params.part;
	deptModel.getpartList(part).then( results => {
		let resObj = {
			count: results.length,
			data: results
		}		
		res.send(resObj);
	}).catch( error => {
		console.log('error : ', error);
		next(error);
	});
}