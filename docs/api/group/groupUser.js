const parameters = [{
  in : "path",
  name: "roomId",
  required: "true",
  schema: {
    type: "string"
  }
}];

module.exports = {
    "/group/user/{roomId}": {
      get: {
        parameters,
        tags: ["Group"],
        summary: "그룹에 속한 유저 전체 불러오기",
        description: "그룹에 속한 유저 전체 불러오기",
        responses: {
          200: {
            description: "그룹에 속한 유저 전체 불러오기",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                        type: "string",
                        description: "그룹에 속한 유저 전체 불러오기",
                        example: "그룹에 속한 모든 유저 아이디 목록을 보냅니다"
                    },
                    usersSelectReseult: {
                        type: "object",
                        description: "유저 정보들",
                        example: [ { user_id: 'admin', name: 'admin', studyTime: 0 } ],
                    }
                  },
                },
              },
            },
          },
          409: {
            description: "Conflict",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                        type: "string",
                        description: "에러 코드 메시지",
                        example: "Conflict",
                    },
                    message: {
                        type: "string",
                        description: "에러 세부 내용",
                        example: "DB Conflict 발생. 잠시 후 다시 시도해주세요.",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };