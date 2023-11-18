module.exports = {
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "사용자 로그아웃",
        description: "사용자 로그아웃 ( signin 때 발급받은 토큰 )",
        
        responses: {
          200: {
            description: "로그아웃 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                        type: "string",
                        description: "응답 결과",
                        example: "로그아웃 되었습니다",
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
                        example: "요청 처리 도중 충돌이 발생했습니다.",
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