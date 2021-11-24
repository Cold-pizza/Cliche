import React, { useEffect, useState, useRef } from "react";
import "./App.scss";
import { Route, withRouter, useHistory } from "react-router-dom";
import firebase from "./firebase";
import { DocumentData } from "firebase/firestore";

import SignUp from "./components/signup";
import Login from "./components/login";
import Main from "./components/main";
import Setting from "./components/setting";
import Notice from "./components/notice";
import Version from "./components/version";
import PlayList from "./components/playlist";
import AlbumEdit from "./components/albumEdit";
import MusicList from "./components/musiclist";
import AddMusic from "./components/addMusic";

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
type Music = {
  title: string;
  singer: string;
  url: string;
}[];

// 함수 type
type OnChange = (e: React.ChangeEvent<HTMLInputElement>) => void;
type CreateUser = (email: string, password: string) => void;
type LoginType = (email: string, password: string) => void;
type LogOutType = () => void;
type OnModal = (id: number) => void;
type UpLoading = () => void;
type AlbumRemove = (id: number) => void;

// export signup.tsx
export interface SignUpIprops {
  createUser: CreateUser;
  account: Account;
  onChange: OnChange;
}
//export login.tsx
export interface LoginIprops {
  login: LoginType;
  account: Account;
  onChange: OnChange;
}
//export playlist.tsx
export interface PlayListIprops {
  album: PlayListType;
  onModal: OnModal;
  albumRemove: AlbumRemove;
}
// export main.tsx
export interface MainIprops {
  album: PlayListType;
  num: number;
  nextNum: number;
  music: Music;
}
// action album up, down
export interface ActionIprops {
  changeAlbum: {
    nextAlbum: () => void;
    beforeAlbum: () => void;
  };
  changeMusic: {
    nextMusic: () => void;
    beforeMusic: () => void;
  };
}
// albumEdit.tsx
export interface AlbumEditIprops {
  album: PlayListType;
}

// musiclist.tsx
export interface MusicListIprops {
  onChangeMusic: OnChange;
  upLoadMusic: UpLoading;
  on: boolean;
  music: Music;
}

// setting.tsx
export interface SettingIprops {
  logout: LogOutType;
}
// addmusic.tsx
export interface AddMusicIprops {
  music: Music;
}

function App() {
  const history = useHistory();
  const [account, setAccount] = useState<Account>({ email: "", password: "" });
  const { email, password } = account;

  // input.value를 account state에 저장.
  const onChange: SignUpIprops["onChange"] = function (e) {
    setAccount({ ...account, [e.target.name]: e.target.value });
    // console.log(account);
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

  //로그아웃 함수.
  const logOut: SettingIprops["logout"] = function () {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("로그아웃 하셨습니다.");
        history.replace("/");
      });
  };

  // 음악 보관소.
  const [music, setMusic] = useState<Music>([
    {
      title: "",
      singer: "",
      url: "",
    },
  ]);
  // firestore에서 음악 가져오기
  useEffect(() => {
    var arr: { title: string; singer: string; url: string }[] = [];
    firebase
      .firestore()
      .collection("playList")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc: DocumentData) => {
          arr.push(doc.data());
        });
      });
    setMusic(arr);
  }, []);
  console.log(music);
  // const [{ title, singer, url }] = music;
  // Main Action 버튼 조절 state.
  let [num, setNum] = useState<MainIprops["num"]>(0);
  let [nextNum, setNextNum] = useState<MainIprops["nextNum"]>(0);

  // 나의 앨범 state.
  const [album, setAlbum] = useState<PlayListType>([
    {
      id: 0,
      title: "favorite",
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
        {
          title: "paint it gold",
          singer: "Glen Check",
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
        {
          title: "가시",
          singer: "buzz",
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
  // 앨범 제거 함수.
  const albumRemove: PlayListIprops["albumRemove"] = function (id) {
    setAlbum(
      album.filter((album) => {
        return album.id !== id;
      })
    );
  };

  // action playlist up, down 버튼기능.
  const changeAlbum: ActionIprops["changeAlbum"] = {
    nextAlbum: function () {
      if (nextNum < album.length - 1) {
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
  // action playlist next, before Music 버튼기능.
  const changeMusic: ActionIprops["changeMusic"] = {
    nextMusic: function () {
      if (nextNum < album[num].playList.length - 1) {
        setNextNum(nextNum + 1);
      } else {
        return nextNum;
      }
    },
    beforeMusic: function () {
      if (nextNum > 0) {
        setNextNum(nextNum - 1);
      } else {
        return nextNum;
      }
    },
  };

  // 음악 저장하고 체크하는 버튼state.
  const [on, setOn] = useState<MusicListIprops["on"]>(false);
  // 노래 저장하기.
  const [musicFile, setFiles] = useState(null);
  // firebase storage.
  const storage = firebase.storage();
  // 음악 파일 받아오는 함수.
  const onChangeMusic: OnChange = (e) => {
    setFiles(e.target.files[0]);
    setOn(!on);
  };

  // 🎵노래 업로드 기능🎵.
  const nextId = useRef(-1);
  const upLoadMusic: UpLoading = function () {
    const storageRef = storage.ref();
    const downLoadPath = storageRef.child("music/" + musicFile.name);
    const upLoading = downLoadPath.put(musicFile);
    upLoading.on(
      "state_changed",
      // 변화할 때, 동작하는 함수.
      (loading) => {
        console.log("로딩중.." + loading);
      },
      //에러시 동작하는 함수.
      (error) => {
        console.log("실패사유: ", error);
      },
      // 성공시 동작하는 함수.
      () => {
        upLoading.snapshot.ref.getDownloadURL().then((url) => {
          console.log("업로드 성공!");
          // const item = {
          //   title: musicFile.name.split("-")[1],
          //   singer: musicFile.name.split("-")[0],
          //   url: url,
          // };
          // // firestore에 title,singer,url 보내는거 추가하기.
          // setMusic([...music, item]);
          setOn(!on);
          // setFiles(null);
          // console.log("업로드된 경로는", url);

          // firestore에 text로 저장.
          const db = firebase.firestore();
          db.collection("playList")
            .doc(musicFile.name)
            .set({
              title: musicFile.name.split("-")[1],
              singer: musicFile.name.split("-")[0],
              url: url,
            });
          // 잘 저장 되었는지 출력.
          // db.collection("playList")
          //   .get()
          //   .then((result) => {
          //     result.forEach((doc) => {
          //       console.log(doc.data());
          //     });
          //   });
        });
      }
    );
  };

  return (
    <div className="App">
      <Nav album={album} num={num} nextNum={nextNum} music={music} />
      <Route exact path="/">
        <Login login={login} account={account} onChange={onChange} />
      </Route>
      <Route path="/signup">
        <SignUp createUser={createUser} account={account} onChange={onChange} />
      </Route>
      <Route path="/main">
        <Main album={album} num={num} nextNum={nextNum} music={music} />
        <Actions changeAlbum={changeAlbum} changeMusic={changeMusic} />
      </Route>

      <Route path="/setting">
        <Setting logout={logOut} />
      </Route>

      {/* setting */}
      <Route path="/notice">
        <Notice />
      </Route>
      <Route path="/version">
        <Version />
      </Route>
      <Route exact path="/playlist">
        <PlayList album={album} onModal={onModal} albumRemove={albumRemove} />
      </Route>
      <Route path="/playlist/:id">
        <AlbumEdit album={album} />
      </Route>
      <Route path="/addmusic/:id">
        <AddMusic music={music} />
      </Route>
      <Route path="/musiclist">
        <MusicList
          onChangeMusic={onChangeMusic}
          upLoadMusic={upLoadMusic}
          on={on}
          music={music}
        />
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
    {
      id: 5,
      title: "앨범편집",
      site: "/playlist/:id",
    },
    {
      id: 6,
      title: "곡 리스트",
      site: "/musiclist",
    },
    {
      id: 7,
      title: "앨범노래추가",
      site: "/addmusic/:id",
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
            {navList.site === "/playlist/:id" ? (
              <p className="edits">완료</p>
            ) : (
              <i
                onClick={() => {
                  history.push("/setting");
                }}
                className="fas fa-cog edits"
              ></i>
            )}
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
        <i
          onClick={() => {
            props.changeMusic.beforeMusic();
          }}
          className="fas fa-chevron-left"
        ></i>
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

        <i
          onClick={() => {
            props.changeMusic.nextMusic();
          }}
          className="fas fa-chevron-right"
        ></i>
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
