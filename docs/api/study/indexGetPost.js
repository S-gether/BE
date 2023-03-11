const Parameters = [{
    in : "path",
    name: "groupId",
    required: "true",
    schema: {
      type: "string"
    }
  }];

  
  module.exports = {
      "/study/{groupId}": {
        post: {
          parameters,
          tags: ["Study"],
          summary: "스터디 시간 갱신",
          description: "스터디 시간 갱신신",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  properties: {
                    time: {
                      type: "int",
                      description: "study time",
                      example: 1204519824,
                    }
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "스터디 시간 갱신 성공",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                          type: "string",
                          description: "스터디 시간 갱신 성공 메시지",
                          example: "해당 유저의 그룹의 공부 시간을 추가했습니다."
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
          tags: ["Study"],
          parameters,
          summary: "그룹에 속한 유저 전체 공부 시간 불러오기",
          description: "그룹에 속한 유저 전체 공부 시간 불러오기",
          responses: {
            200: {
              description: "스터디 그룹 공부시간 불러오기 결과",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                          type: "string",
                          description: "스터디 그룹 공부 시간 요청 성공 메시지",
                          example: "해당 그룹에 속한 전체 유저의 스터디 시간 정보입니다."
                      },
                      groupSelectReseult: {
                          type: "object",
                          description: "공부 시간 내역",
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