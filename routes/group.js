const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  verifyToken,
  isMasterId,
} = require("../middleware/accessController.js");
const { makeHashedValue } = require("../lib/security");
const { checkBodyFields } = require("../lib/funcs");
const moment = require("moment-timezone");
const { verify } = require("crypto");
moment.tz.setDefault("Asia/Seoul");

let conn = "";
require("../db/sqlCon.js")().then((res) => (conn = res));

let redisLocalCon = "";
require("../db/redisLocalCon.js")().then((res) => (redisLocalCon = res));

router.post("/", verifyToken, async (req, res) => {
  const body = req.body;
  const token = req.decoded;
  const nowTime = moment().format("YYYY-M-D H:m:s");
  const roomId = await makeHashedValue(body.room_name);

  let pwdFlag = false;
  let roomPwd = "";
  try {
    const mustIncludedThingsArray = ["room_name", "accommodation", "explain"];
    const bodyCheckResult = checkBodyFields(body, mustIncludedThingsArray);
    if (
      bodyCheckResult.organization.length === 0 ||
      bodyCheckResult.authenticatedBlanckFlag
    ) {
      return res.status(409).json({
        error: "Conflict",
        message: "필수 기입 정보 중 누락된 부분이 있습니다.",
      });
    }
    if (body.room_pwd !== undefined) {
      roomPwd = await makeHashedValue(body.room_pwd);
      pwdFlag = true;
    }

    const roomCreateInfo = [
      roomId,
      token.id,
      body.room_name,
      body.accommodation,
      roomPwd,
      body.explain,
      pwdFlag,
      nowTime,
      nowTime,
    ];
    console.log(roomCreateInfo);
    await conn.execute(
      "INSERT INTO `group` VALUES (?,?,?,?,?,?,?,?,?)",
      roomCreateInfo
    );

    return res.status(201).json({
      message: "스터디 그룹이 성공적으로 생성됐습니다.",
      roomId,
      roomPwdResult: pwdFlag,
    });
  } catch (err) {
    console.log(err);
    return res.status(406).json({
      error: "Not Acceptable",
      message: "올바르지 않은 스터디 그룹 정보입니다.",
    });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const [groupsSelectReseult, fieldUser] = await conn.execute(
      "SELECT id, master_id ,room_name ,accommodation, `explain`, created_at FROM `group`"
    );
    return res.status(200).json({
      message: "전체 스터디그룹 정보를 전송합니다.",
      groupsSelectReseult,
    });
  } catch (err) {
    console.log(err);
    return res.status(409).json({
      error: "Conflict",
      message: "DB Conflict 발생. 잠시 후 다시 시도해주세요.",
    });
  }
});

router.get("/user/:roomId", verifyToken, async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const [usersSelectReseult, fieldUser] = await conn.execute(
      "SELECT join_group.user_id, user_auth.name FROM join_group LEFT JOIN user_auth ON join_group.user_id = user_auth.id WHERE join_group.group_id = ?",
      [roomId]
    );
    const usersInfo = [];
    for await (user of usersSelectReseult) {
      const studyTime = await conn.execute(
        "SELECT total_time FROM study_time WHERE user_id = ?",
        [user.user_id]
      );
      const userInfo = await conn.execute(
        "SELECT * FROM user_info WHERE user_id = ?",
        [user.user_id]
      );
      if (studyTime) {
        user.studyTime = 0;
      } else {
        user.studyTime = studyTime[0][0].total_time;
      }
      user.email = userInfo[0][0].email;
      user.introduce = userInfo[0][0].introduce;
      usersInfo.push(user);
    }
    console.log(usersInfo);
    return res.status(200).json({
      message: `그룹에 속한 모든 유저 아이디 목록을 보냅니다`,
      usersInfo,
    });
  } catch (err) {
    console.log(err);
    return res.status(409).json({
      error: "Conflict",
      message: "DB Conflict 발생. 잠시 후 다시 시도해주세요.",
    });
  }
});

router.get("/:roomId", verifyToken, async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const [groupSelectReseult, fieldUser] = await conn.execute(
      "SELECT id, master_id,room_name,accommodation,`explain` ,created_at FROM `group` WHERE id = ?",
      [roomId]
    );
    return res.status(200).json({
      message: "특정 스터디그룹 정보를 전송합니다.",
      groupSelectReseult,
    });
  } catch (err) {
    console.log(err);
    return res.status(409).json({
      error: "Conflict",
      message: "DB Conflict 발생. 잠시 후 다시 시도해주세요.",
    });
  }
});

router.put("/:roomId", verifyToken, isMasterId, async (req, res) => {
  const body = req.body;
  console.log(req.params);
  const nowTime = moment().format("YYYY-M-D H:m:s");
  try {
    const roomId = await conn.execute("SELECT id FROM `group` WHERE id = ?", [
      req.params.roomId,
    ]);
    if (roomId[0].length === 0) {
      return res.status(406).json({
        error: "Not Acceptable",
        message: "잘못된 스터디 그룹 ID 정보입니다.",
      });
    }
    let updateFlag = false;
    Object.keys(body).forEach((key) => {
      if (body[key] !== "") {
        updateFlag = true;
      }
    });
    if (updateFlag !== true) {
      return res.status(204).json({
        code: "204 No Content",
        message: "변경 사항이 없습니다.",
      });
    }

    let newRoomId = "";
    for await (let key of Object.keys(body)) {
      if (key === "room_name") {
        const newRoomName = body[key];
        newRoomId = await makeHashedValue(newRoomName);
        await conn.execute(
          "UPDATE `group` SET room_name = ?, updated_at = ? WHERE id = ?",
          [newRoomName, nowTime, req.params.roomId]
        );
      } else if (key === "room_pwd") {
        const newRoomPwd = await makeHashedValue(body[key]);
        await conn.execute(
          "UPDATE `group` SET room_pwd = ?, pwd_flag = ?, updated_at = ? WHERE id = ?",
          [newRoomPwd, true, nowTime, req.params.roomId]
        );
      } else if (key === "accommodation") {
        await conn.execute(
          "UPDATE `group` SET accommodation = ?, updated_at = ? WHERE id = ?",
          [body[key], nowTime, req.params.roomId]
        );
      } else if (key === "explain") {
        await conn.execute(
          "UPDATE `group` SET `explain` = ?, updated_at = ? WHERE id = ?",
          [body[key], nowTime, req.params.roomId]
        );
      } else {
        throw new Error(
          "Client request key is not matched to the db column name."
        );
      }
    }
    if (newRoomId !== "") {
      await conn.execute("UPDATE `group` SET id = ? WHERE id = ?", [
        newRoomId,
        req.params.roomId,
      ]);
    }
    return res.status(201).json({
      message: `${req.params.roomId}에 대한 수정 요청 사항을 처리했습니다.`,
      result: "success",
    });
  } catch (err) {
    return res.status(409).json({
      error: "Conflict",
      message: err.message,
    });
  }
});

router.delete("/:roomId", verifyToken, isMasterId, async (req, res) => {
  try {
    const roomId = await conn.execute("SELECT id FROM `group` WHERE id = ?", [
      req.params.roomId,
    ]);
    if (roomId[0].length === 0) {
      return res.status(406).json({
        error: "Not Acceptable",
        message: "잘못된 스터디 그룹 ID 정보입니다.",
      });
    }
    await conn.execute("DELETE FROM `group` WHERE id = ?", [req.params.roomId]);
    return res.status(200).json({
      message: `${req.params.roomId}에 대한 삭제 요청 사항을 처리했습니다.`,
      result: "success",
    });
  } catch (err) {
    return res.status(409).json({
      error: "Conflict",
      message: err.message,
    });
  }
});

const notAllowedMsg = {
  error: "Method Not Allowed",
  message: "허가되지 않은 메소드입니다.",
};

// router.route('/')
// 	.delete(async (req, res) => {
// 		return res.status(405).json(notAllowedMsg);
// 	})
// 	.put(async (req, res) => {
// 		return res.status(405).json(notAllowedMsg);
// 	})

module.exports = router;
