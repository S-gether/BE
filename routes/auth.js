const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {verifyToken, pwdChangeAllowingCheck, notlogedIn} = require('../middleware/accessController.js');
const { checkBodyFields } = require('../lib/funcs');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');



let conn = "";
require('../db/sqlCon.js')().then((res) => conn = res);

let redisLocalCon = "";
require('../db/redisLocalCon.js')().then((res) => redisLocalCon = res);

const { createHashedPassword, makePasswordHashed, makeResidentNumHashedById, makeResidentNumHashedByName } = require('../lib/security.js');




router.post('/signup',notlogedIn, async (req, res) => {
	const body = req.body;
  	try {
		const nowTime = moment().format("YYYY-M-D H:m:s");
		const mustIncludedThingsArray = ['id','pwd','name','residentNum','email'];
        const bodyCheckResult = checkBodyFields(body, mustIncludedThingsArray);
		if (bodyCheckResult.organization.length === 0 || bodyCheckResult.authenticatedBlanckFlag) {
			return res.status(409).json({
				error : "Conflict", 
				message: "필수 기입 정보 중 누락된 부분이 있습니다."
			});
		}
		
		const [userSelectResult, fieldUser] = await conn.execute('SELECT * FROM user_auth WHERE id = ?', [body.id]);
		console.log(userSelectResult);
		if (userSelectResult.length > 0) {
			return res.status(400).json({
				error : "Bad Request", 
				message: "이미 존재하는 아이디입니다."
			});
		}


		const pwdCrypt = await createHashedPassword(body.pwd);
		const resCrypt = await createHashedPassword(body.residentNum);
		if (body.authority === null) {
			body.authority = "student"
		}
		const userInfo = [body.id, pwdCrypt.crypt,body.authority ,body.name, resCrypt.crypt,pwdCrypt.salt,resCrypt.salt, nowTime, nowTime];
		await conn.execute('INSERT INTO user_auth VALUES (?,?,?,?,?,?,?,?,?)', userInfo);
		
		if (body.introduce === null) {
			body.introduce = ""
		}
		await conn.execute('INSERT INTO user_info VALUES (?,?,?,?,?,?)', [null, body.id, body.email, body.introduce,nowTime,nowTime])

		console.log("회원 DB 저장 성공");
		return res.status(201).json(
			{
				message : "회원가입에 성공했습니다. 회원의 비밀번호는 암호화 처리됩니다.",
				issue : "암호화 시간이 조금 소요될 수 있으니 기다려주세요."
			}
		);
	} catch (err) {
		console.error(err);
		return res.status(406).json(
			{
				error : "Not Acceptable", 
				message: "올바르지 않은 회원 정보입니다."
			}
		);
	}
});

router.post('/signin', notlogedIn, async (req, res) => {
	
	const body = req.body;
	try {
		const [userSelectResult, fieldUser] = await conn.execute('SELECT * FROM user_auth WHERE id = ?', [body.id]);
		const recordedUserInfo = userSelectResult[0];
		const password = await makePasswordHashed(body.id, body.pwd);
		if (recordedUserInfo.pwd === password) {
			const token = jwt.sign({
				id: recordedUserInfo.id,
				name : recordedUserInfo.name,
				authority : recordedUserInfo.authority
			}, process.env.JWT_SECRET, {
				issuer: 'api-server'
			});
			
			await redisLocalCon.set(recordedUserInfo.id, token);
			
			return res.status(200).json(
				{
					message : "로그인 성공! 토큰은 DB에 저장되어 관리됩니다.",
					issue : "암호화 시간이 조금 소요될 수 있으니 기다려주세요.",
					token
				}
			);	
			
		} else {
			return res.status(409).json(
				{
					error : "Conflict",
					message : "비밀번호가 일치하지 않습니다."
				}
			);
		}
		
	} catch (err) {
		console.log(err);
		return res.status(406).json(
			{
				error : "Not Acceptable",
				message : "회원 가입되지 않은 회원입니다."
			}
		);
	}
	
});

router.post('/idFound',notlogedIn, async (req, res) => {
	try {
		const body = req.body;
		const residentNum = await makeResidentNumHashedByName(body.name ,body.residentNum);
		const [userSelectResult, fieldUser] = await conn.execute('SELECT id FROM user_auth WHERE name = ? AND residentNum = ?', [body.name, residentNum]);
		if (userSelectResult.length === 0) {
			return res.status(401).json(
				{
					error : "Unauthorized",
					message : "회원 가입되지 않은 회원입니다."
				}
			);
		}
		return res.status(200).json(
			{
				message : "회원정보를 찾았습니다.",
				id : userSelectResult[0].id
			}
		);	

	} catch (err) {
		console.log(err);
		return res.status(406).json(
			{
				error : "Not Acceptable", 
				message: "가입 정보가 없는 회원입니다."
			}
		);
	}
});

router.post('/pwdFound',notlogedIn, async (req, res) => {
	try {
		const body = req.body;
		const residentNum = await makeResidentNumHashedById(body.id ,body.residentNum);
		console.log(residentNum);
		const [userSelectResult, fieldUser] = await conn.execute('SELECT * FROM user_auth WHERE id = ? AND name = ? AND residentNum = ?', [body.id, body.name ,residentNum]);
		console.log(userSelectResult);
		if (userSelectResult.length === 0) {
			return res.status(401).json(
				{
					error : "Unauthorized",
					message : "회원 가입되지 않은 회원입니다."
				}
			);
		}
		const pwdAllowToken = jwt.sign({
			id: body.id,
			name: body.name,
			allowResult: true
		}, process.env.JWT_SECRET, {
			issuer: 'api-server'
		});

		return res.status(200).json(
			{
				message : "유저 정보를 확인했습니다. /auth/pwdFound/changePwd 라우터로 요청을 토큰과 함께 보내주세요",
				pwdAllowToken
			}
		);	


	} catch (err) {
		return res.status(406).json(
			{
				error : "Not Acceptable", 
				message: "가입 정보가 없는 회원입니다."
			}
		);
	}
});

router.post('/pwdFound/changePwd', pwdChangeAllowingCheck, async (req, res) => {
	try {
		const nowTime = moment().format("YYYY-M-D H:m:s");
		const userInfoToken = req.decoded;
		const body = req.body;
		const newPwd = body.newPwd;
		const pwdCrypt = await createHashedPassword(newPwd);

		await conn.execute('UPDATE user_auth SET pwd = ?, pwdSalt = ?, updated_at = ? WHERE id = ?', [pwdCrypt.crypt, pwdCrypt.salt, nowTime, userInfoToken.id]);

		return res.status(200).json(
			{
				message:  "비밀번호 변경 완료!"
			}
		);	
	} catch (err) {
		return res.status(406).json(
			{
				error : "Not Acceptable", 
				message: "가입 정보가 없는 회원입니다."
			}
		);
	}
});

router.post('/logout',verifyToken, async (req, res) => {
	const token = req.decoded;
	try {
		await redisLocalCon.del(token.id);
		return res.status(200).json({
			message : "로그아웃 되었습니다."
		});
	} catch (err) {
		console.log(err);
		return res.status(409).json({
			error: "Conflict",
			message : "요청 처리 도중 충돌이 발생했습니다."

		});
	}
});


const notAllowedMsg = {
	error : "Method Not Allowed", 
	message: "허가되지 않은 메소드입니다."
}

router.route('/signin')
	.get(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})
	.delete(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})
	.put(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})

router.route('/signup')
	.get(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})
	.delete(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})
	.put(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})

router.route('/logout')
	.get(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})
	.delete(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})
	.put(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})

router.route('/idFound')
	.get(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})
	.delete(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})
	.put(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})

router.route('/pwdFound')
	.get(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})
	.delete(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})
	.put(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})

router.route('/pwdFound/changePwd')
	.get(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})
	.delete(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})
	.put(async (req, res) => {
		return res.status(405).json(notAllowedMsg);
	})	
module.exports = router;

