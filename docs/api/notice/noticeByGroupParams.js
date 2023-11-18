const parameters = [{
    in : "path",
    name: "groupId",
    required: "true",
    schema: {
      type: "string"
    }
  }];
  
  module.exports = {
      "/notice/{groupId}": {
        post: {
          parameters,
          tags: ["Notice"],
          summary: "그룹 공지 생성",
          description: "그룹 공지 생성 관련",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  properties: {
                    title: {
                      type: "string",
                      description: "notice title",
                      example: "notice title",
                    }, 
                    content: {
                      type: "string",
                      description: "notice content",
                      example: "notice content",
                    }
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "그룹 공지 생성 성공",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                          type: "string",
                          description: "그룹 공지 생성 성공 메시지",
                          example: "그룹 공지가 성공적으로 생성됐습니다."
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
                          example: "올바르지 않은 공지 정보입니다.",
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
                            example: "필수 기입 정보 중 누락된 부분이 있습니다.",
                        },
                      },
                    },
                  },
                },
              },
          },
        },
        get: {
          tags: ["Notice"],
          parameters,
          summary: "스터디 그룹 공지 불러오기",
          description: "스터디 그룹 공지 불러오기",
          responses: {
            200: {
              description: "스터디 그룹 불러오기 결과",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                          type: "string",
                          description: "스터디그룹 공지 내역 전송 메시지",
                          example: "전체 스터디그룹 공지 내역들을 전송합니다."
                      },
                      noticesSelectReseult: {
                          type: "object",
                          description: "스터디그룹 공지 내역",
                          example: [],
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