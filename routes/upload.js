const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/accessController.js');
const moment = require('moment-timezone');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
moment.tz.setDefault('Asia/Seoul');

try {
    fs.readdirSync(path.join(__dirname, '../public/images'));
} catch (error) {
    console.error('not exist directory.');
    fs.mkdirSync(path.join(__dirname, '../public/images'));
}

const upload = multer({
    // 파일 저장 위치 (disk , memory 선택)
    storage: multer.diskStorage({
        destination: function (req, file, done) {
            done(null, path.join(__dirname, '../public/images'));
        },
        filename: async function (req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + ext);
        }
    }),
});

let conn = "";
require('../db/sqlCon.js')().then((res) => conn = res);


router.post('/group/:groupId', verifyToken, upload.single('upload'), async (req, res) => {
	const file = req.file;
    const ext = path.extname(file.originalname);
    const imgPath = path.basename(file.originalname, ext) + ext
    const groupId = req.params.groupId;
    const nowTime = moment().format("YYYY-M-D H:m:s");
	try {
        const groupImgUploadInfo = [null, groupId, imgPath, nowTime, nowTime];
        await conn.execute('INSERT INTO `img_group` VALUES (?,?,?,?,?)', groupImgUploadInfo);
		return res.status(201).json({
			message : "그룹 프로필 사진이 성공적으로 저장됐습니다.",
		});
	} catch (err) {
        console.log(err);
		return res.status(406).json(
			{
				error : "Not Acceptable", 
				message: "사진 저장에 실패했습니다. 올바른 사진 파일인지 확인해주세요"
			}
		);
	}
});

router.post('/user', verifyToken, upload.single('upload'), async (req, res) => {
	const file = req.file;
    const ext = path.extname(file.originalname);
    const imgPath = path.basename(file.originalname, ext) + ext
    const token = req.decoded
    const nowTime = moment().format("YYYY-M-D H:m:s");
	try {
        const userImgUploadInfo = [null, token.id, imgPath, nowTime, nowTime];
        await conn.execute('INSERT INTO `img_user` VALUES (?,?,?,?,?)', userImgUploadInfo);
		return res.status(201).json({
			message : "유저 프로필 사진이 성공적으로 저장됐습니다.",
		});
	} catch (err) {
        console.log(err);
		return res.status(406).json(
			{
				error : "Not Acceptable", 
				message: "사진 저장에 실패했습니다. 올바른 사진 파일인지 확인해주세요"
			}
		);
	}
});

router.get('/user/:userId', verifyToken, async (req, res) => {
    const userId = req.params.userId
	try {
        const [userImgSelectResult, field] = await conn.execute('SELECT img_path FROM img_user WHERE user_id = ?', [userId]); 
		if (!userImgSelectResult) {
            throw new Error();
        }
		console.log(userImgSelectResult[0]);
        return res.sendFile(path.join(__dirname, '../public/images', userImgSelectResult[0].img_path));
	} catch (err) {
        console.log(err);
		return res.status(406).json(
			{
				error : "Not Acceptable", 
				message: "등록된 파일이 없습니다."
			}
		);
	}
});

router.get('/group/:groupId', verifyToken, async (req, res) => {
    const groupId = req.params.groupId
	try {
        const [groupImgSelectResult, field] = await conn.execute('SELECT img_path FROM img_group WHERE group_id = ?', [groupId]); 
        if (!groupImgSelectResult) {
            throw new Error();
        }
        return res.sendFile(path.join(__dirname, '../public/images', groupImgSelectResult[0].img_path));
	} catch (err) {
        console.log(err);
		return res.status(406).json(
			{
				error : "Not Acceptable", 
				message: "등록된 파일이 없습니다."
			}
		);
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

