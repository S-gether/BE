module.exports = {
    "/auth/pwdFound": {
      post: {
        tags: ["Auth"],
        summary: "사용자 비밀번호 찾기",
        description: "사용자 비밀번호 찾기 (id, name, residentNum)",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {
                  id: {
                    type: "string",
                    description: "user id",
                    example: "userId",
                    },  
                  name: {
                    type: "string",
                    description: "user name",
                    example: "홍길동",
                  }, 
                  residentNum: {
                    type: "string",
                    description: "user residentNum",
                    example: "990000-1000000",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "사용자 비밀번호 탐색 요청 허용",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                        type: "string",
                        description: "회원 정보 탐색 성공 메시지",
                        example: "유저 정보를 확인했습니다. /auth/pwdFound/changePwd 라우터로 요청을 토큰과 함께 보내주세요",
                    },
                    token: {
                        type: "token",
                        description: "비밀번호 찾기 허용 토큰",
                        example: "apdsiofnew.asndfneiwo.asdkfnalv",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                        type: "string",
                        description: "에러 코드 메시지",
                        example: "Unauthorized",
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
                        example: "가입 정보가 없는 회원입니다.",
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