

module.exports = {
  "/upload/user/": {
    post: {
      tags: ["Upload"],
      summary: "유저 프로필 업로드",
      description: "유저 프로필 업로드 관련",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                upload: {
                  type: "string",
                  format: "binary"
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "유저 프로필 사진 업로드 성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                      type: "string",
                      description: "유저 공지 생성 성공 메시지",
                      example: "유저 프로필 사진이 성공적으로 저장됐습니다."
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
                      example: "사진 저장에 실패했습니다. 올바른 사진 파일인지 확인해주세요",
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