const express = require('express');
const router = express.Router();
const { verifyToken, isMasterId, isAuthorId } = require('../middleware/accessController.js');
const { checkBodyFields } = require('../lib/funcs');
const { makeHashedValue } = require('../lib/security');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

let conn = "";
require('../db/sqlCon.js')().then((res) => conn = res);

router.post('/:groupId', verifyToken, async (req, res) => {
	const body = req.body;
    const token = req.decoded;
    const groupId = req.params.groupId;
    const nowTime = moment().format("YYYY-M-D H:m:s");
	try {
        const mustIncludedThingsArray = ['title', 'content'];
        const bodyCheckResult = checkBodyFields(body, mustIncludedThingsArray);
		if (bodyCheckResult.organization.length === 0 || bodyCheckResult.authenticatedBlanckFlag) {
			return res.status(409).json({
				error : "Conflict", 
				message: "필수 기입 정보 중 누락된 부분이 있습니다."
			});
		}
        const noticeId = await makeHashedValue(body.title);
        const noticeCreateInfo = [noticeId ,groupId, body.title, token.id, body.content, nowTime, nowTime];

        await conn.execute('INSERT INTO `notice` VALUES (?,?,?,?,?,?,?)', noticeCreateInfo);
		
		return res.status(201).json({
			message : "그룹 공지가 성공적으로 생성됐습니다.",
            groupId
		});
	} catch (err) {
		console.log(err);
		return res.status(406).json(
			{
				error : "Not Acceptable", 
				message: "올바르지 않은 공지 정보입니다."
			}
		);
	}
});

router.get('/:groupId', verifyToken, async (req, res) => {
    const groupId = req.params.groupId;
	try {
        const [noticesSelectReseult, fieldUser] = await conn.execute('SELECT * FROM `notice` WHERE group_id = ?',[groupId]);
		return res.status(200).json({
			message : "전체 스터디그룹 공지 내용들을 전송합니다.",
            noticesSelectReseult
		});
	} catch (err) {
		console.log(err);
		return res.status(409).json({
            error : "Conflict", 
            message: "DB Conflict 발생. 잠시 후 다시 시도해주세요."
        });
	}
});

router.put('/:noticeId', verifyToken, async (req, res) => {
    const body = req.body;
    const nowTime = moment().format("YYYY-M-D H:m:s");
    const noticeId = req.params.noticeId;
	try {        
        let updateFlag = false;
        Object.keys(body).forEach((key) => {
            if (body[key] !== "") {
                updateFlag = true;
            }
        });
        if (updateFlag !== true) {
            return res.status(204).json({
				code : "204 No Content", 
				message: "변경 사항이 없습니다."
			});
        }

		for await (let key of Object.keys(body)) {
			if (key === 'title') {
                const newTitle = body[key];
                await conn.execute('UPDATE `notice` SET title = ?, updated_at = ? WHERE id = ?', [newTitle, nowTime, noticeId]);
			} else if (key === 'content') {
                const newContent = body[key];
				await conn.execute('UPDATE `notice` SET content = ?, updated_at = ? WHERE id = ?', [newContent, nowTime, noticeId]);
			} else {
				throw new Error('Client request key is not matched to the db column name.');
			}
		}

		return res.status(201).json({
			message : `${noticeId}에 대한 수정 요청 사항을 처리했습니다.`,
            result: "success"
		});
	} catch (err) {
		return res.status(409).json({
            error : "Conflict", 
            message: err.message
        });
	}
});

router.delete('/:noticeId', verifyToken, isAuthorId, async (req, res) => {
	try {
        const roomId = await conn.execute('SELECT id FROM `notice` WHERE id = ?', [req.params.noticeId]);
		if (roomId[0].length === 0) {
			return res.status(406).json({
				error : "Not Acceptable", 
				message: "잘못된 스터디 그룹 공지 ID 정보입니다."
			});
		}
        await conn.execute('DELETE FROM `notice` WHERE id = ?', [req.params.noticeId]);
		return res.status(200).json({
			message : `${req.params.noticeId}에 대한 삭제 요청 사항을 처리했습니다.`,
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

// router.route('/')
// 	.delete(async (req, res) => {
// 		return res.status(405).json(notAllowedMsg);
// 	})
// 	.put(async (req, res) => {
// 		return res.status(405).json(notAllowedMsg);
// 	})


module.exports = router;

