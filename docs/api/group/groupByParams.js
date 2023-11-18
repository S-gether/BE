const parameters = [{
  in : "path",
  name: "roomId",
  required: "true",
  schema: {
    type: "string"
  }
}];

module.exports = {
    "/group/{roomId}": {
      put: {
        parameters,
        tags: ["Group"],
        summary: "스터디 그룹 수정",
        description: "스터디 그룹 내용 수정( room_name, accommodation, room_pwd, explain )",
        
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {
                  room_name: {
                    type: "string",
                    description: "room name",
                    example: "study group name",
                  }, 
                  accommodation: {
                    type: "int",
                    description: "room accommodation",
                    example: 5,
                  },
                  room_pwd: {
                    type: "string",
                    description: "room pwd (not neccessary)",
                    example: "1q2w3e4r",
                  },
                  explain: {
                    type: "string",
                    description: "room explain",
                    example: "1학년 3반 스터디룸",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "room id에 대한 수정 성공 메시지",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                        type: "string",
                        description: "스터디 그룹 수정 메시지",
                        example: "room Id 에 대한 수정 요청 사항을 처리했습니다."
                    },
                    result: {
                        type: "string",
                        description: "스터디 그룹 수정 여부",
                        example: "success",
                    },
                  },
                },
              },
            },
          },
          204: {
            description: "수정 사항이 없음",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: {
                        type: "string",
                        description: "code message",
                        example: "204 No Content",
                    },
                    message: {
                        type: "string",
                        description: "code message",
                        example: "변경 사항이 없습니다."
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
      delete: {
        tags: ["Group"],
        parameters,
        summary: "스터디 그룹 삭제",
        description: "스터디 그룹 삭제",
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
                        description: "room Id 방 삭제 메시지",
                        example: "room Id 에 대한 삭제 요청 사항을 처리했습니다."
                    },
                    result: {
                        type: "string",
                        description: "스터디 그룹 수정 여부",
                        example: "success",
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
      get: {
        tags: ["Group"],
        parameters,
        summary: "특정 스터디 그룹 불러오기",
        description: "특정 스터디 그룹 불러오기",
        responses: {
          200: {
            description: "특정 스터디 그룹 불러오기",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                        type: "string",
                        description: "스터디 그룹 조회 메시지",
                        example: "특정 스터디그룹 정보를 전송합니다."
                    },
                    groupsSelectReseult: {
                        type: "object",
                        description: "스터디 그룹 전체 정보",
                        example: [{room_info_1:"방 정보"}],
                    }
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
                        example: "DB Conflict 발생. 잠시 후 다시 시도해주세요.",
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