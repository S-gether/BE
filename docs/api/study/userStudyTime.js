
  module.exports = {
      "/study/": {
        get: {
          tags: ["Study"],
          summary: "유저의 공부 시간 불러오기",
          description: "유저의 공부 시간 불러오기",
          responses: {
            200: {
              description: "유저의 공부 시간 불러오기",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                          type: "string",
                          description: "유저의 스터디 시간 정보 요청 성공 메시지",
                          example: "해당 유저의 스터디 시간 정보입니다."
                      },
                      userSelectReseult :{
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