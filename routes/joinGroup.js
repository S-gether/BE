const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { verifyToken, isMasterId } = require('../middleware/accessController.js');
const { makeHashedValue } = require('../lib/security');
const { checkBodyFields } = require('../lib/funcs');
const moment = require('moment-timezone');
const { verify } = require('crypto');
moment.tz.setDefault('Asia/Seoul');

let conn = "";
require('../db/sqlCon.js')().then((res) => conn = res);

let redisLocalCon = "";
require('../db/redisLocalCon.js')().then((res) => redisLocalCon = res);


router.post('/:groupId', verifyToken, async (req, res) => {
	const groupId = req.params.groupId;
    const token = req.decoded;
    const nowTime = moment().format("YYYY-M-D H:m:s");
	try {
		const [groupsSelectReseult, fieldUser] = await conn.execute('SELECT * FROM `join_group` WHERE user_id = ? and group_id = ?', [token.id, groupId]);
		if (groupsSelectReseult.length !== 0) {
			return res.status(406).json(
				{
					error : "Not Acceptable", 
					message: "이미 참여한 그룹입니다."
				}
			);
		}
		const joinGroupInfo = [null, token.id, groupId, nowTime, nowTime];
		const joinGroupStudyTimeInfo = [null, token.id, nowTime, 0, nowTime, nowTime, groupId]

		await conn.execute('INSERT INTO join_group VALUES (?,?,?,?,?)', joinGroupInfo);
		await conn.execute('INSERT INTO study_time VALUES (?,?,?,?,?,?,?)', joinGroupStudyTimeInfo);

		

		return res.status(201).json({
			message : `${groupId} 그룹에 ${token.id} 유저가 참여했습니다.`,
            groupId,
		});
	} catch (err) {
		console.log(err);
		return res.status(406).json(
			{
				error : "Not Acceptable", 
				message: "올바르지 않은 스터디 그룹 정보입니다. 그룹 아이디를 확인해주세요"
			}
		);
	}
});

router.get('/', verifyToken, async (req, res) => {
    const token = req.decoded;
	try {
		
		const [groupsSelectReseult, fieldUser] = await conn.execute('SELECT group_id FROM `join_group` WHERE user_id = ?', [token.id]);
		return res.status(200).json({
			message : `${token.id}가 참여한 그룹의 목록입니다.`,
            groupsSelectReseult
		});
	} catch (err) {
		return res.status(409).json(
			{
				error : "Conflict", 
				message: "DB READ CONFLICT ERROR"
			}
		);
	}
});

router.delete('/:groupId', verifyToken, async (req, res) => {
	const token = req.decoded
	try {
        const groupSelectResult = await conn.execute('SELECT group_id FROM join_group WHERE group_id = ? AND user_id = ?', [req.params.groupId, token.id]);
		if (groupSelectResult[0].length === 0) {
			return res.status(406).json({
				error : "Not Acceptable", 
				message: "잘못된 스터디 그룹 ID 정보이거나 가입되지 않은 그룹의 탈퇴 요청입니다."
			});
		}
        await conn.execute(`DELETE FROM join_group WHERE group_id = ? AND user_id = ?`, [req.params.groupId, token.id]);
		return res.status(200).json({
			message : `${req.params.groupId}에 대한 탈퇴 요청 사항을 처리했습니다.`,
            result: "success"
		});
	} catch (err) {
		return res.status(409).json({
            error : "Conflict", 
            message: err.message
        });
	}
});


const notAllowedMsg = {
	error : "Method Not Allowed", 
	message: "허가되지 않은 메소드입니다."
}

router.route('/')
	.put(async (req, res) => {
		return res.status(405).join(notAllowedMsg);
	});

// router.route('/')
// 	.delete(async (req, res) => {
// 		return res.status(405).json(notAllowedMsg);
// 	})
// 	.put(async (req, res) => {
// 		return res.status(405).json(notAllowedMsg);
// 	})


module.exports = router;

