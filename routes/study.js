const express = require('express');
const router = express.Router();
const { verifyToken} = require('../middleware/accessController.js');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

let conn = "";
require('../db/sqlCon.js')().then((res) => conn = res);

router.get('/', verifyToken, async (req, res) => {
    const token = req.decoded;
	try {
        const [userSelectReseult, fieldUser] = await conn.execute('SELECT * FROM `study_time` WHERE user_id = ?',[token.id]);
		return res.status(200).json({
			message : "해당 유저의 스터디 시간 정보입니다.",
            userSelectReseult
		});
	} catch (err) {
		console.log(err);
		return res.status(409).json({
            error : "Conflict", 
            message: "DB Conflict 발생. 잠시 후 다시 시도해주세요."
        });
	}
});

router.get('/:groupId', verifyToken, async (req, res) => {
    const groupId = req.params.groupId
	try {
        const [groupSelectReseult, fieldUser] = await conn.execute('SELECT * FROM `study_time` WHERE group_id = ?',[groupId]);
		return res.status(200).json({
			message : "해당 그룹에 속한 전체 유저의 스터디 시간 정보입니다.",
            groupSelectReseult
		});
	} catch (err) {
		console.log(err);
		return res.status(409).json({
            error : "Conflict", 
            message: "DB Conflict 발생. 잠시 후 다시 시도해주세요."
        });
	}
});

router.post('/:groupId', verifyToken, async (req, res) => {
    const nowDate = moment().format("YYYY-M-D");
    const nowTime = moment().format("YYYY-M-D H:m:s");
    const token = req.decoded;
    const groupId = req.params.groupId;
    const body = req.body;
	try {
        const updateStudyTime = body.time;
        const aiCount =body.aiCount;
        const updateInfos = [null, token.id, nowDate, updateStudyTime, nowTime, nowTime, groupId,aiCount]
        
        await conn.execute('INSERT INTO `study_time` VALUES (?,?,?,?,?,?,?,?)', updateInfos);
        
		return res.status(201).json({
			message : "해당 유저의 그룹의 공부 시간을 추가했습니다.",
		});
	} catch (err) {
		console.log(err);
		return res.status(409).json({
            error : "Conflict", 
            message: "DB Conflict 발생. 잠시 후 다시 시도해주세요."
        });
	}
});


const notAllowedMsg = {
	error : "Method Not Allowed", 
	message: "허가되지 않은 메소드입니다."
}

router.route('/')
    .delete(async (req, res) => {
        return res.status(405).json(notAllowedMsg);
    })
    .post(async (req, res) => {
        return res.status(405).json(notAllowedMsg);
    })


module.exports = router;

