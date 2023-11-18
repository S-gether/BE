module.exports = {
      "/joinGroup/": {
        get: {
          tags: ["JoinGroup"],
          summary: "스터디 그룹 목록",
          description: "스터디 그룹 목록 가져오기",
          responses: {
            200: {
              description: "유저가 참여한 그룹 목록",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                          type: "string",
                          description: "그룹 목록 메시지",
                          example: "id가 참여한 그룹의 목록입니다."
                      },
                      groupsSelectReseult: {
                          type: "object",
                          description: "참여한 그룹 목록",
                          example: [{groupInfo:"group info"},{groupInfo:"group info"}],
                      },
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
                            example: "DB READ CONFLICT ERROR",
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