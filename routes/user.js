const express = require('express');
const router = express.Router();
const { verifyToken, isMasterId, isAuthorId } = require('../middleware/accessController.js');
const { checkBodyFields } = require('../lib/funcs');
const { makeHashedValue } = require('../lib/security');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

let conn = "";
require('../db/sqlCon.js')().then((res) => conn = res);

router.get('/', verifyToken, async (req, res) => {
    const token = req.decoded
	try {
        const [userSelectReseult, fieldUser] = await conn.execute('SELECT * FROM `user_info` WHERE user_id = ?',[token.id]);
		return res.status(200).json({
			message : "해당 유저의 일반 정보입니다.",
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



router.put('/', verifyToken, async (req, res) => {
    const body = req.body;
    const nowTime = moment().format("YYYY-M-D H:m:s");
    const token = req.decoded
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
			if (key === 'email') {
                const newEmail = body[key];
                await conn.execute('UPDATE `user_info` SET email = ?, updated_at = ? WHERE id = ?', [newEmail, nowTime, token.id]);
			} else if (key === 'introduce') {
                const newIntroduce = body[key];
				await conn.execute('UPDATE `notice` SET content = ?, updated_at = ? WHERE id = ?', [newIntroduce, nowTime, token.id]);
			} else {
				throw new Error('Client request key is not matched to the db column name.');
			}
		}

		return res.status(201).json({
			message : `${token.id}에 대한 수정 요청 사항을 처리했습니다.`,
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
    .delete(async (req, res) => {
        return res.status(405).json(notAllowedMsg);
    })
    .post(async (req, res) => {
        return res.status(405).json(notAllowedMsg);
    })


module.exports = router;

