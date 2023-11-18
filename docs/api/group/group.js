module.exports = {
    "/group/": {
      get: {
        tags: ["Group"],
        summary: "스터디 그룹 전체 불러오기",
        description: "스터디 그룹 전체 불러오기",
        responses: {
          200: {
            description: "스터디 그룹 전체 불러오기",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                        type: "string",
                        description: "스터디 그룹 조회 메시지",
                        example: "전체 스터디그룹 정보를 전송합니다."
                    },
                    groupsSelectReseult: {
                        type: "object",
                        description: "스터디 그룹 전체 정보",
                        example: [{room_info_1:"방 정보",room_info_2:"방 정보",room_info_3:"방 정보"}],
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
      post: {
        tags: ["Group"],
        summary: "스터디 그룹 생성",
        description: "스터디 그룹 생성( room_name, accommodation, room_pwd, explain )",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {
                  room_name: {
                    type: "string",
                    description: "room name",
                    example: "study group name",
                  }, 
                  accommodation: {
                    type: "int",
                    description: "room accommodation",
                    example: 5,
                  },
                  room_pwd: {
                    type: "string",
                    description: "room pwd (not neccessary)",
                    example: "1q2w3e4r",
                  },
                  explain: {
                    type: "string",
                    description: "room explain (not neccessary)",
                    example: "1학년 4반 스터디룸",
                  }
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "스터디 그룹 생성 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                        type: "string",
                        description: "스터디 그룹 생성 메시지",
                        example: "회원가입에 성공했습니다. 회원의 비밀번호는 암호화 처리됩니다."
                    },
                    roomId: {
                        type: "string",
                        description: "스터디 그룹 id 식별자",
                        example: "agnewionakls.a/.baklnafeadf",
                    },
                    roomPwdResult: {
                        type: "boolean",
                        description: "방 pwd 여부",
                        example: "true",
                    }
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
                        example: "올바르지 않은 스터디 그룹 정보입니다.",
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
    },
  };