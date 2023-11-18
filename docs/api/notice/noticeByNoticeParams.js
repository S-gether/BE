const parameters = [{
    in : "path",
    name: "noticeId",
    required: "true",
    schema: {
      type: "string"
    }
  }];
  
  module.exports = {
      "/notice/{noticeId}": {
        put: {
          parameters,
          tags: ["Notice"],
          summary: "그룹 공지 수정",
          description: "그룹 공지 수정 관련",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  properties: {
                    title: {
                      type: "string",
                      description: "notice title",
                      example: "notice title",
                    }, 
                    content: {
                      type: "string",
                      description: "notice content",
                      example: "notice content",
                    }
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "그룹 공지 수정 성공",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                          type: "string",
                          description: "그룹 공지 수정 성공 메시지",
                          example: "noticeId에 대한 수정 요청 사항을 처리했습니다."
                      },
                      result: {
                          type: "string",
                          description: "수정 성공",
                          example: "success",
                      },
                    },
                  },
                },
              },
            },
            204: {
              description: "204 No Content",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                          type: "string",
                          description: "에러 코드 메시지",
                          example: "204 No Content",
                      },
                      message: {
                          type: "string",
                          description: "에러 세부 내용",
                          example: "변경 사항이 없습니다.",
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
                            example: "에러메시지 전체가 들어갑니다.",
                        },
                      },
                    },
                  },
                },
              },
          },
        },
        delete: {
          tags: ["Notice"],
          parameters,
          summary: "스터디 그룹 공지 삭제",
          description: "스터디 그룹 공지 삭제",
          responses: {
            200: {
              description: "스터디 그룹 삭제 결과",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                          type: "string",
                          description: "스터디그룹 공지 삭제 메시지",
                          example: "id에 대한 삭제 요청 사항을 처리했습니다."
                      },
                      result: {
                          type: "string",
                          description: "스터디그룹 공지 삭제",
                          example: "success",
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
                            example: "잘못된 스터디 그룹 공지 ID 정보입니다.",
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
                          example: "에러 메시지 전체가 들어갑니다.",
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