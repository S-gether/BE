  module.exports = {
      "/user/": {
        get: {
          tags: ["User"],
          summary: "유저 일반 정보 불러오기",
          description: "유저 일반 정보 불러오기",
          responses: {
            200: {
              description: "유저 일반 정보 불러오기 성공공",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                          type: "string",
                          description: "일반 정보 불러오기 성공 메시지",
                          example: "해당 유저의 일반 정보입니다."
                      },
                      userSelectReseult: {
                          type: "object",
                          description: "일반 정보 객체",
                          example: [{id:"id",user_id:"user_id",email: "email", etc:"기타 정보가 더 들어감"}],
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
                            example: "DB Conflict 발생. 잠시 후 다시 시도해주세요.",
                        },
                      },
                    },
                  },
                },
              },
          },
        },
        put: {
          tags: ["User"],
          summary: "유저 일반 정보 수정하기",
          description: "유저 일반 정보 수정하기",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  properties: {
                    email: {
                      type: "string",
                      description: "new email",
                      example: "newemail@email.com",
                    }, 
                    introduce: {
                      type: "string",
                      description: "new introduce",
                      example: "new introduce",
                    }
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "일반 유저 정보 수정 성공",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                          type: "string",
                          description: "일반 유저 정보 수정 성공 메시지",
                          example: "요청 ID에 대한 수정 요청 사항을 처리했습니다."
                      },
                      result: {
                          type: "string",
                          description: "성공 여부",
                          example: "success",
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