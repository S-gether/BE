const parameters = [{
    in : "path",
    name: "userId",
    required: "true",
    schema: {
        type: "string"
    }
  }
  ];
module.exports = {
    "/upload/user/{userId}": {
        get: {
            tags: ["Upload"],
            parameters,
            summary: "유저 프로필 사진 불러오기",
            description: "유저 프로필 사진을 받아옵니다.",
            responses: {
              200: {
                description: "",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                            type: "string",
                            description: "유저 프로필 사진 파일이 응답됩니다.",
                            example: "유저 프로필 사진 파일이 응답됩니다."
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
                            example: "등록된 파일이 없습니다.",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
      },
}