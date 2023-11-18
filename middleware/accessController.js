const jwt = require('jsonwebtoken');

let redisLocalCon = "";
require('../db/redisLocalCon.js')().then((res) => redisLocalCon = res);

let conn = "";
require('../db/sqlCon.js')().then((res) => conn = res);

exports.verifyToken = async (req, res, next) => {
	try {
		req.decoded = jwt.verify(req.headers.authorization.replace(/^Bearer\s/, ''), process.env.JWT_SECRET);
		if(req.decoded.allowResult) {
			return res.status(403).json({
				error : '403 Forbidden',
				message: 'Authorization 토큰이 아닙니다.'
			});
		}
		const DBSearchResult = await redisLocalCon.get(req.decoded.id);
		
		if (DBSearchResult !== null) {
			return next();	
		} else {
			throw new Error('TokenExpiredError');
		}
		
	} catch (err) {
		if (err.name == "TokenExpiredError") {
			return res.status(403).json({
					error : '403 Forbidden',
					message: '토큰이 만료됐습니다.'
				});
		}
		console.log(err);
		return res.status(403).json({
					error : '403 Forbidden',
					message: '유효하지 않은 토큰입니다.'
				});
	}
}

exports.notlogedIn = async (req, res, next) => {
	try {
		if (req.headers.authorization === undefined) {
			return next();
		} else {
			return res.status(403).json({
				error : '403 Forbidden',
				message: '로그인 된 상태로 접근할 수 없는 라우터입니다.'
			});
		}
	} catch (err) {
		console.log(err);
	}
}

exports.pwdChangeAllowingCheck = async (req, res, next) => {
	try {
		const jwtToken = req.headers.authorization.replace(/^Bearer\s/, '');
		req.decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
		
		if (req.decoded.allowResult) {
			return next();	
		} else {
			throw new Error('Not PWD Change Token');
		}
		
	} catch (err) {
		if (err.name == "TokenExpiredError") {
			return res.status(403).json({
					error : '403 Forbidden',
					message: '토큰이 만료됐습니다.'
				});
		}
		return res.status(403).json({
					error : '403 Forbidden',
					message: 'PWD 변경 토큰이 아닙니다.'
		});
	}
}

exports.isMasterId = async (req, res, next) => {
	try {
		const token = jwt.verify(req.headers.authorization.replace(/^Bearer\s/, ''), process.env.JWT_SECRET);
		const [masterIdSelectResult, field] = await await conn.execute('SELECT master_id FROM `group` WHERE master_id = ?', [token.id]);
		if (masterIdSelectResult.length !== 0) {
			return next();
		} else {
			return res.status(403).json({
				error : '403 Forbidden',
				message: '방장만 접근 가능한 라우터입니다. 방장이라면 방이 존재하는지 확인하세요.'
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(403).json({
			error : '403 Forbidden',
			message: '유효하지 않은 토큰입니다.'
		});
	}
}

exports.isAuthorId = async (req, res, next) => {
	try {
		const token = jwt.verify(req.headers.authorization.replace(/^Bearer\s/, ''), process.env.JWT_SECRET);
		const [masterIdSelectResult, field] = await await conn.execute('SELECT author FROM `notice` WHERE author = ?', [token.id]);
		if (masterIdSelectResult.length !== 0) {
			return next();
		} else {
			return res.status(403).json({
				error : '403 Forbidden',
				message: '공지 작성자만 접근 가능한 라우터입니다. 공지 작성자라면 방이 존재하는지 확인하세요.'
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(403).json({
			error : '403 Forbidden',
			message: '유효하지 않은 토큰입니다.'
		});
	}
}