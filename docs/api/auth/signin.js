module.exports = {
    "/auth/signin": {
      post: {
        tags: ["Auth"],
        summary: "사용자 로그인",
        description: "사용자 로그인(id, pwd) / 토큰에는 id, name, authority가 들어갑니다.",
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
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "사용자 로그인 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                        type: "string",
                        description: "로그인 성공 메시지",
                        example: "로그인 성공! 토큰은 DB에 저장되어 관리됩니다.",
                    },
                    issue: {
                        type: "string",
                        description: "특이사항",
                        example: "암호화 시간이 조금 소요될 수 있으니 기다려주세요.",
                    },
                    token: {
                        type: "token",
                        description: "토큰",
                        example: "qweionklasdfnfa.alkdnfioqewnfoqd.ioewnagoinklsd"
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
                        example: "회원 가입되지 않은 회원입니다.",
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
                        example: "비밀번호가 일치하지 않습니다.",
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