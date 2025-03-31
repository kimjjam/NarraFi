```
💡 IDE 우측 상단의 `미리보기`를 통해 README.md 파일을 읽어주세요!
```

# goormIDE

구름IDE에 오신 것을 환영합니다!

구름IDE는 개발자들을 위한 강력한 클라우드IDE입니다.

`즐거운 코딩하세요! -구름IDE팀-`

## 커스텀 채팅 웹 만들기

💡 [구름 블로그](https://blog.goorm.io/chatweb/)를 통해 프로젝트에 대해 더 자세히 알아볼 수 있어요! 


- 기술
    - 본 프로젝트는 `React.js` `socket.io` `materialUI` `express`를 중점적으로 사용합니다.
- 대상
    - React를 공부해보고 싶으신 분
    - socket.io를 이용한 소켓 통신의 매력을 느껴보고싶으신 분
    - 내가 만들고 싶은 프로젝트는 명확히 없지만 흥미로운 주제의 웹 프로젝트를 찾고계신 분
    - 나만의 채팅방을 자유롭게 커스텀하여 완성시켜보고싶으신 분
- 상세 설명
    - socket.io를 이용하여 채팅방 입장, 메시지 송/수신은 구현되어있습니다.
        - JOIN_ROOM, SEND_MESSAGE, UPDATE_MESSAGE 등의 이벤트 명으로 작성.
        - DB는 기본적으로 연결하지 않도록 구현되어있습니다.
        - DB 기본 세팅은 MongoDB 연결을 설정해두었고, server/src/index.js 파일의 주석 처리를 해제하고 config 파일에서 설정하여 사용가능합니다.
    - 실제로 메시지를 DB에 넣어 관리하고, 각 유저별로 프로필을 추가하고, 채팅방 리스트를 만들어보는 등 마음껏 커스텀하여 나만의 구르미톡을 만들어보세요!
- 폴더구조

```
.
|-- exit.sh
|-- start.sh
|-- client
|   |-- node_modules
|   |-- package-lock.json
|   |-- package.json
|   |-- .env.development
|   |-- public
|   `-- src
|		|-- components
|		|   |-- Chat
|		|   |-- ChatRoomEntry
|		|   `-- Message
|		|-- containers
|		|   |-- Chat.jsx
|		|   `-- ChatRoomEntry.jsx
|		|-- contexts
|		|   `-- SocketContext.jsx
|		|-- index.js
|		`-- pages
|		    |-- chat.jsx
|		    |-- main.jsx
|		    `-- page.module.scss
|
`-- server
    |-- config
    |   `-- default.js
    |-- node_modules
    |-- package-lock.json
    |-- package.json
    `-- src
        |-- controllers
        |-- middlewares
        |    `-- index.js
        |-- models
        |    |-- sample
        |    `-- index.js
        |-- routes
        |-- services
        |-- index.js
        `-- sample.js

```

## 🎨 Usage

1. URL과 포트 확인
    1. 상단 메뉴바의 `컨테이너 > 실행URL과포트` 클릭하기
    2. client, server 도메인을 각각 3000, 3001 포트로 등록하기 (domain은 자유롭게 !)
    3. 프로젝트 실행 시 3000에 client, 3001에 server가 띄워집니다.
2. 환경변수 및 config 설정
    1. client 경로에 `.env.development` 파일에 `REACT_APP_SERVER_URL = 1번에서 설정한 server 도메인` 을 넣어줍니다.
    2. server 경로에 `config/default.js` 파일에 다음과 같이 설정해줍니다.
    ```
    module.exports = {
        db: { //mongo db를 사용할 경우 세팅해줍니다.
           mongoUrl:"",
        },
        port: 3001, //1번에서 설정한 서버 포트에 맞게 설정합니다.
        client: "" //1번에서 설정한 client 도메인을 넣어줍니다.
    }
    ```
3. 의존성 확인
    1. 하단 터미널에 다음과 같이 입력하여 클라이언트와 서버에 필요한 모듈을 설치해줍니다.
	2. `cd client && npm i && cd ../server && npm i && cd ..`
4. 프로젝트 시작하기
    - 실행 명령어(IDE 우측 상단) 실행하기
        - `run client and server` 를 클릭하여 실행해줍니다.
    - 실행 URL(상단 메뉴바 `컨테이너 > 실행URL과포트`) 들어가기
        - client 포트로 등록되어있는 URL 들어가기
    - 앱 사용해보기
        - 동일한 CHATROOM ID 로 들어가면 채팅이 가능합니다.

## 🔧 Tip & Guide

- 명령어 기능
    - 우측 상단에 프로젝트 실행만으로 프로젝트를 실행하실 수 있습니다.
    - 좌측 메뉴바의 `명령어 > 공통/빌드/실행/테스트/배포` 메뉴로도 실행하실 수 있습니다.
- URL과 PORT
    - `프로젝트 > 실행URL과 포트`에서 포트와 URL을 확인 및 변경하실 수 있습니다.
    - 처음에는 Default 값이 들어가 있습니다.