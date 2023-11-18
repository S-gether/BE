const parameters = [{
        in : "path",
        name: "groupId",
        required: "true",
        schema: {
            type: "string"
        }
    }
];
  
  module.exports = {
      "/upload/group/{groupId}": {
        post: {
          parameters,
          tags: ["Upload"],
          summary: "그룹 프로필 업로드",
          description: "그룹 프로필 업로드 관련",
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
              description: "그룹 프로필 사진 업로드 성공공",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                          type: "string",
                          description: "그룹 공지 생성 성공 메시지",
                          example: "그룹 프로필 사진이 성공적으로 저장됐습니다."
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
        get: {
            tags: ["Upload"],
            parameters,
            summary: "그룹 프로필 사진 불러오기",
            description: "그룹 프로필 사진을 받아옵니다.",
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
                            description: "그룹 프로필 사진 파일이 응답됩니다.",
                            example: "그룹 프로필 사진 파일이 응답됩니다."
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
    };