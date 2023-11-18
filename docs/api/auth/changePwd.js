module.exports = {
    "/auth/pwdFound/changePwd": {
      post: {
        tags: ["Auth"],
        summary: "사용자 비밀번호 변경",
        description: "사용자 비밀번호 변경 (newPwd) + 토큰에 사용자 비밀번호 변경 허가 토큰을 넣어주세요.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {
                  newPwd: {
                    type: "string",
                    description: "new user pwd",
                    example: "1q2w3e4r!!",
                    },  
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "사용자 비밀번호 변경 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                        type: "string",
                        description: "비밀번호 변경 여부 확인 메세지",
                        example: "비밀번호 변경 완료!",
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