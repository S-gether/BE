module.exports = {
    "/auth/idFound": {
      post: {
        tags: ["Auth"],
        summary: "사용자 아이디 찾기",
        description: "사용자 아이디 찾기 (name, residentNum)",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {
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
            description: "사용자 아이디 찾음",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                        type: "string",
                        description: "회원 정보 탐색 성공 메시지",
                        example: "회원정보를 찾았습니다.",
                    },
                    id: {
                        type: "string",
                        description: "유저 아이디",
                        example: "userIdExample",
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