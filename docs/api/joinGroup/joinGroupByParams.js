const parameters = [{
    in : "path",
    name: "groupId",
    required: "true",
    schema: {
      type: "string"
    }
  }];
  
  module.exports = {
      "/joinGroup/{groupId}": {
        post: {
          parameters,
          tags: ["JoinGroup"],
          summary: "스터디 그룹 참여",
          description: "스터디 그룹 참여 관련",
          responses: {
            201: {
              description: "그룹 참여 성공",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                          type: "string",
                          description: "그룹 참여 성공 메시지",
                          example: "groupId 그룹에 id 유저가 참여했습니다."
                      },
                      groupId: {
                          type: "string",
                          description: "참여한 그룹 아이디",
                          example: "12ionsdklafnio2w",
                      },
                    },
                  },
                },
              },
            },
            406: {
              description: "Not Acceptable",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                          type: "string",
                          description: "에러 코드 메시지",
                          example: "Not Acceptable",
                      },
                      message: {
                          type: "string",
                          description: "에러 세부 내용",
                          example: "올바르지 않은 스터디 그룹 정보입니다. 그룹 아이디를 확인해주세요",
                      },
                    },
                  },
                },
              },
            },
            406: {
              description: "Not Acceptable",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                          type: "string",
                          description: "에러 코드 메시지",
                          example: "Not Acceptable",
                      },
                      message: {
                          type: "string",
                          description: "에러 세부 내용",
                          example: "이미 참여한 그룹입니다.",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ["JoinGroup"],
          parameters,
          summary: "스터디 그룹 탈퇴",
          description: "스터디 그룹 탈퇴",
          responses: {
            200: {
              description: "스터디 그룹 삭제 결과",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                          type: "string",
                          description: "groupId 탈퇴 메시지",
                          example: "groupId에 대한 탈퇴 요청 사항을 처리했습니다."
                      },
                      result: {
                          type: "string",
                          description: "스터디 그룹 탈퇴 성공 여부",
                          example: "success",
                      },
                    },
                  },
                },
              },
            },
            406: {
                description: "Not Acceptable",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: {
                            type: "string",
                            description: "에러 코드 메시지",
                            example: "Not Acceptable",
                        },
                        message: {
                            type: "string",
                            description: "에러 세부 내용",
                            example: "잘못된 스터디 그룹 ID 정보이거나 가입되지 않은 그룹의 탈퇴 요청입니다.",
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
                          example: "에러 메시지 전체가 들어갑니다.",
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