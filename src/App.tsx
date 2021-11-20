import React, { useState } from "react";
import "./App.scss";
import { Route, withRouter, useHistory } from "react-router-dom";
import firebase from "./firebase";

import SignUp from "./components/signup";
import Login from "./components/login";
import Main from "./components/main";
import Setting from "./components/setting";
import Notice from "./components/notice";
import Version from "./components/version";
import PlayList from "./components/playlist";

//uesState type
type Account = {
  email: string;
  password: string;
};
type PlayListType = {
  id: number;
  title: string;
  info: string;
  playList: {
    title: string;
    singer: string;
  }[];
  active: boolean;
}[];

// 함수 type
type OnChange = (e: React.ChangeEvent<HTMLInputElement>) => void;
type CreateUser = (email: string, password: string) => void;
type Login = (email: string, password: string) => void;
type OnModal = (id: number) => void;

// export signup.tsx
export interface SignUpIprops {
  createUser: CreateUser;
  account: Account;
  onChange: OnChange;
}
//export login.tsx
export interface LoginIprops {
  login: Login;
  account: Account;
  onChange: OnChange;
}
//export playlist.tsx
export interface PlayListIprops {
  album: PlayListType;
  onModal: OnModal;
}
// export main.tsx
export interface MainIprops {
  album: PlayListType;
  num: number;
}
// action album up, down
export interface ActionIprops {
  changeAlbum: {
    nextAlbum: () => void;
    beforeAlbum: () => void;
  };
}

function App() {
  const history = useHistory();
  const [account, setAccount] = useState<Account>({ email: "", password: "" });
  const { email, password } = account;

  // input.value를 account state에 저장.
  const onChange: SignUpIprops["onChange"] = function (e) {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };
  // 계정만들기 function
  const createUser: SignUpIprops["createUser"] = async function () {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log("가입 성공!");
        setAccount({ email: "", password: "" });
        history.replace("/");
      })
      .catch(() => {
        console.log("가입 실패!");
      });
  };

  // 로그인 기능
  const login: LoginIprops["login"] = function (email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("로그인성공!");
        setAccount({ email: "", password: "" });
        history.push("/main");
      })
      .catch(() => {
        console.log("다시 입력해주세요..");
      });
  };

  // Main 플레이리스트
  let [num, setNum] = useState<MainIprops["num"]>(0);
  console.log(num);
  const [isBtn, setBtn] = useState(false);
  const [album, setAlbum] = useState<PlayListType>([
    {
      id: 0,
      title: "untitled",
      info: "glen check, 한요한, 10cm..",
      playList: [
        {
          title: "Ive got this feeling",
          singer: "Glen Check",
        },
        {
          title: "람보르기니",
          singer: "Han Yo Han",
        },
      ],
      active: false,
    },
    {
      id: 1,
      title: "rock balad",
      info: "buzz, 김상민..",
      playList: [
        {
          title: "남자를 몰라",
          singer: "버즈",
        },
        {
          title: "YOU",
          singer: "김상민",
        },
      ],
      active: false,
    },
  ]);
  // 앨범설정 추가, 삭제 모달.
  const onModal: OnModal = function (id) {
    setAlbum(
      album.map((list) => {
        return list.id === id ? { ...list, active: !list.active } : list;
      })
    );
  };

  // action playlist up, down 버튼기능.
  const changeAlbum: ActionIprops["changeAlbum"] = {
    nextAlbum: function () {
      if (num < album.length - 1) {
        setNum(num + 1);
      } else {
        return num;
      }
    },
    beforeAlbum: function () {
      if (num > 0) {
        setNum(num - 1);
      } else {
        return num;
      }
    },
  };

  return (
    <div className="App">
      <Nav album={album} num={num} />
      <Route exact path="/">
        <Login login={login} account={account} onChange={onChange} />
      </Route>
      <Route path="/signup">
        <SignUp createUser={createUser} account={account} onChange={onChange} />
      </Route>
      <Route path="/main">
        <Main album={album} num={num} />
        <Actions changeAlbum={changeAlbum} />
      </Route>

      <Route path="/setting">
        <Setting />
      </Route>

      {/* setting */}
      <Route path="/notice">
        <Notice />
      </Route>
      <Route path="/version">
        <Version />
      </Route>
      <Route path="/playlist">
        <PlayList album={album} onModal={onModal} />
      </Route>
    </div>
  );
}

const Nav: React.FC<MainIprops> = function (props): JSX.Element {
  const history = useHistory();
  const [navList, setNavList] = useState([
    {
      id: 0,
      title: "",
      site: "/main",
    },
    {
      id: 1,
      title: "설정",
      site: "/setting",
    },
    {
      id: 2,
      title: "공지사항",
      site: "/notice",
    },
    {
      id: 3,
      title: "버전정보",
      site: "/version",
    },
    {
      id: 4,
      title: "앨범",
      site: "/playlist",
    },
  ]);
  return (
    <div id="nav">
      {navList.map((navList) => {
        return (
          <Route exact path={navList.site}>
            <i
              onClick={() => {
                history.goBack();
              }}
              className="fas fa-chevron-left"
            ></i>
            <span>
              {navList.site === "/main"
                ? (navList.title = props.album[props.num].title)
                : navList.title}
            </span>
            <i
              onClick={() => {
                history.push("/setting");
              }}
              className="fas fa-cog"
            ></i>
          </Route>
        );
      })}
    </div>
  );
};

const Actions: React.FC<ActionIprops> = function (props): JSX.Element {
  const [play, setPlay] = useState(false);
  return (
    <div id="actions">
      <section className="up-btn">
        <i
          onClick={() => {
            props.changeAlbum.beforeAlbum();
          }}
          className="fas fa-chevron-up"
        ></i>
      </section>
      <section className="middle-btn">
        <i className="fas fa-chevron-left"></i>
        {play ? (
          <i
            onClick={() => {
              setPlay(!play);
            }}
            className="fas fa-pause play-btn"
          ></i>
        ) : (
          <i
            onClick={() => {
              setPlay(!play);
            }}
            className="fas fa-play play-btn"
          ></i>
        )}

        <i className="fas fa-chevron-right"></i>
      </section>
      <section className="bottom-btn">
        <i
          onClick={() => {
            props.changeAlbum.nextAlbum();
          }}
          className="fas fa-chevron-down"
        ></i>
      </section>
    </div>
  );
};

export default withRouter(App);
