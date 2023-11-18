module.exports = {
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "사용자 회원가입",
        description: "사용자 회원가입(id, pwd, name, residentNum, email, introduce)",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {
                  id: {
                    type: "string",
                    description: "user Id",
                    example: "userIdInput",
                  }, 
                  pwd: {
                    type: "string",
                    description: "user password",
                    example: "1q2w3e4r",
                  },
                  name: {
                    type: "string",
                    description: "user name",
                    example: "honggildong",
                  },
                  residentNum: {
                    type: "string",
                    description: "user resident num",
                    example: "990000-1000000",
                  },
                  authority: {
                    type: "string",
                    description: "user authority",
                    example: "admin / student",
                  },
                  email: {
                    type: "string",
                    description: "user email address",
                    example: "helloworld@gmail.com",
                  },
                  introduce: {
                    type: "string",
                    description: "user self introduce",
                    example: "꿈꾸는 개발자 화니입니다.",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "사용자 회원가입 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                        type: "string",
                        description: "회원가입 성공 메시지",
                        example: "회원가입에 성공했습니다. 회원의 비밀번호는 암호화 처리됩니다.",
                    },
                    issue: {
                        type: "string",
                        description: "특이사항",
                        example: "암호화 시간이 조금 소요될 수 있으니 기다려주세요.",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                        type: "string",
                        description: "에러 코드 메시지",
                        example: "Bad Request",
                    },
                    message: {
                        type: "string",
                        description: "에러 세부 내용",
                        example: "이미 존재하는 아이디입니다.",
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
                        example: "올바르지 않은 회원 정보입니다.",
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
                        example: "회원 정보 중 누락된 부분이 있습니다.",
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