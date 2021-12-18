import React, { useState, useRef } from "react";
import "./App.scss";
import { Route, withRouter, useHistory } from "react-router-dom";
import firebase from "./firebase";

// import Component
import SignUp from "./components/signup";
import Login from "./components/login";
import Main from "./components/main";
import Setting from "./components/setting";
import Version from "./components/version";
import AlbumEdit from "./components/albumEdit";
import MusicList from "./components/musiclist";
import AddMusic from "./components/addMusic";
import AddAlbum from "./components/addAlbum";

import { DocumentData } from "@google-cloud/firestore";
import { setOriginalNode } from "typescript";

//useState type
type AccountType = {
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
type MusicType = {
  id: number;
  title: string;
  singer: string;
  url: string;
  active: boolean;
}[];
type AnyType = any;

type AddAlbumStateType = {
    name: string;
    info: string;
    id: number;
    playList: {
      title: string;
      singer: string;
    }[];
    active: boolean;
  }

// 함수 type
type OnChangeType = (e: React.ChangeEvent<HTMLInputElement>) => void;
type OnChangeAlbumType = (e: React.ChangeEvent<HTMLInputElement>) => void;
type CreateUserType = (email: string, password: string) => void;
type LoginType = (email: string, password: string) => void;
type LogOutType = () => void;
type OnModalType = (id: number) => void;
type UpLoadingType = () => void;
type AlbumRemoveType = (id: number) => void;
type PlayTheMusicType = () => void;
type PauseTheMusicType = () => void;
type AddAlbumType = () => void;

// export signup.tsx
export interface SignUpIprops {
  createUser: CreateUserType;
  account: AccountType;
  onChange: OnChangeType;
}

//export login.tsx
export interface LoginIprops {
  login: LoginType;
  account: AccountType;
  onChange: OnChangeType;
}

//export playlist.tsx
export interface PlayListIprops {
  album: PlayListType;
  onModal: OnModalType;
  albumRemove: AlbumRemoveType;
}

// export main.tsx
export interface MainIprops {
  album: PlayListType;
  num: number;
  nextNum: number;
  music: MusicType;
  player: AnyType;
  source: AnyType;
  fileInitial: ()=> void;
}

// Action 컴포넌트 컨트롤러 type
export interface ActionIprops {
  changeAlbum: {
    nextAlbum: () => void;
    beforeAlbum: () => void;
  };
  changeMusic: {
    nextMusic: () => void;
    beforeMusic: () => void;
  };
  playTheMusic: PlayTheMusicType;
  pauseTheMusic: PauseTheMusicType;
}

// albumEdit.tsx
export interface AlbumEditIprops {
  album: PlayListType;
  music: MusicType;
}

// musiclist.tsx
export interface MusicListIprops {
  onChangeMusic: OnChangeType;
  upLoadMusic: UpLoadingType;
  on: boolean;
  music: MusicType;
  removeModal: (id:number) => void;
  removeMusic: (id:number) => void;
  fileRef: any;
  musicFileName: string;
}

// setting.tsx
export interface SettingIprops {
  logout: LogOutType;
}

// addMusic.tsx
export interface AddMusicIprops {
  music: MusicType;
}

// addAlbum.tsx
export interface AddAlbumIprops {
  album: PlayListType;
  onChangeAlbum: OnChangeAlbumType;
  addAlbumState: AddAlbumStateType;
  addAlbum: AddAlbumType;
}

// App Component
function App() {
  const history = useHistory();
  const [account, setAccount] = useState<AccountType>({ email: "", password: "" });
  const { email, password } = account;

  // input.value를 account state에 저장.
  const onChange: SignUpIprops["onChange"] = function (e) {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  // 계정만드는 함수.
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

  // firebase에서 음악 받아온 보관소.
  const [music, setMusic] = useState<MusicType>([]);

  // 로그인 함수.
  const login: LoginIprops["login"] = function (email, password) {
     firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        setAccount({ email: "", password: "" });
        // 로그인 성공하면 데이터 불러오는 함수.
        async function getMusic() {
          let arr: { id:number; title: string; singer: string; url: string; active: boolean; }[] = [];
          await firebase
          .firestore()
          .collection("playList")
          .get().then((snapshot) => {
            snapshot.forEach((doc:DocumentData) => {
              return arr.push(doc.data());
            });
          });
          await setMusic(arr);
        }
       await getMusic();
        console.log("로그인성공!");
       await history.push("/main");
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
        // if (fileRef.current.value === '') {
        //   fileRef.current.files[0] = '';
        // }
        console.log("로그아웃 하셨습니다.");
        setOn(!on);
        history.replace("/");
      });
  };


  // Main 컴포넌트 Action 버튼 조절 state.
  let [num, setNum] = useState<MainIprops["num"]>(0);
  let [nextNum, setNextNum] = useState<MainIprops["nextNum"]>(0);

  // 나의 앨범 state.
  const [album, setAlbum] = useState<PlayListType>([
    {
      id: 0,
      title: "favorite",
      info: "",
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
      info: "",
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

  // 앨범 추가시킬 state.
  const [addAlbumState, setAddAlbumState] = useState<AddAlbumIprops['addAlbumState']>({
      id:3, 
      name:'',
      playList:[{ title: "", singer: "" }], 
      info:"", 
      active: false 
    });
    const onChangeAlbum = function(e:React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setAddAlbumState({ ...addAlbumState, [name]: value })
    }
    const { id, name, playList, info, active } = addAlbumState;
 
  // 앨범설정 추가, 삭제 모달.
  const onModal: OnModalType = function (id) {
    setAlbum(
      album.map((list) => {
        return list.id === id ? { ...list, active: !list.active } : list;
      })
    );
  };
  // Music state 제거 함수.
  const removeModal:MusicListIprops['removeModal'] = function(id) {
    setMusic(
      music.map((list)=> {
        return list.id === id ? { ...list, active: !list.active } : list;
      })
    )
  }
  // addAlbum state id.
  let [nextId, setNextId] = useState<number>(3);

  const addAlbum:AddAlbumIprops['addAlbum'] = function() {
    const item = { title: test.name, id, playList, info, active };
    setAlbum([ ...album, item ])
    setAddAlbumState({ id: nextId, name: "", playList, info:"", active: false });
    setNextId(nextId + 1);
  }
  // 앨범 제거 함수.
  const albumRemove: PlayListIprops["albumRemove"] = function (id) {
    setAlbum(
      album.filter((album) => {
        return album.id !== id;
      })
    );
  };
  // 노래 삭제 함수.
  const removeMusic:MusicListIprops['removeMusic'] = function(id) {
    if (music[id].active) {
      setMusic(
        music.filter((music)=>{
          return music.id !== id;
        })
        )
      }
  }

  // action playlist up, down 버튼기능.
  const changeAlbum: ActionIprops["changeAlbum"] = {
    nextAlbum: function () {
      if (nextNum < album.length - 1) {
        setNum(num + 1);
        player.current.load();
      } else {
        return num;
      }
    },
    beforeAlbum: function () {
      if (num > 0) {
        setNum(num - 1);
        player.current.load();
      } else {
        return num;
      }
    },
  };
  // action playlist next, before Music 버튼기능.
  const changeMusic: ActionIprops["changeMusic"] = {
    nextMusic: function () {
      if (nextNum < music.length - 1) {
        setNextNum(nextNum + 1);
        player.current.load();
      } else {
        return nextNum;
      }
    },
    beforeMusic: function () {
      if (nextNum > 0) {
        setNextNum(nextNum - 1);
        player.current.load();
      } else {
        return nextNum;
      }
    },
  };
  // audio 지정 ref.
  const player = useRef<AnyType>();
  const source = useRef<AnyType>();

  // Action 컴포넌트 컨트롤러 플레이 함수.
  const playTheMusic: PlayTheMusicType = function() {
    // player.current.load();
    player.current.play();
  }
  const pauseTheMusic: PauseTheMusicType = function() {
    // player.current.load();
    player.current.pause();
  }

  // 음악 저장하고 체크하는 버튼state.
  const [on, setOn] = useState<MusicListIprops["on"]>(false);
  // 노래 저장하기.
  const [musicFile, setFiles] = useState(null);
  // firebase storage.
  const storage = firebase.storage();
  // 노래파일 선택 ref.
  const fileRef = useRef<MusicListIprops["fileRef"]>(null);
  // 음악파일 제목 state.
  const [musicFileName, setMusicFileName] = useState<MusicListIprops["musicFileName"]>("");
  // 음악 파일 받아오는 함수 + 노래파일 이름 표시.
  const onChangeMusic: OnChangeType = (e) => {
    setFiles(e.target.files[0]);
    setOn(!on);
    if (fileRef !== null) {
      const fileNameRef = fileRef.current.value;
      const fileNames = fileNameRef.split("\\")[2];
      setMusicFileName(fileNames);
    }
  };
  // 🎵노래 업로드 기능🎵.(firestore에 text로 저장하기)
  const upLoadMusic: UpLoadingType = function () {
    const storageRef = storage.ref();
    const downLoadPath = storageRef.child("music/" + musicFile.name);
    const upLoading = downLoadPath.put(musicFile);
    upLoading.on(
      "state_changed",
      // 변화할 때, 동작하는 함수.
      (loading) => {
        // error, loading 타입 변경하기..
        console.log("로딩중..", loading);
      },
      //에러시 동작하는 함수.
      (error) => {
        // 타입 변경!!
        console.log("실패사유: ", error);
      },
      // 성공시 동작하는 함수.
      () => {
        upLoading.snapshot.ref.getDownloadURL().then((url) => {
          console.log("업로드 성공!");
          setMusicFileName(null);
          setOn(!on);

          // firestore에 text로 저장.
          const db = firebase.firestore();
          db.collection("playList")
            .doc(musicFile.name)
            .set({
              title: musicFile.name.split("-")[1],
              singer: musicFile.name.split("-")[0],
              url: url,
              active: false,
            });
        });
      }
    );
  };

  // 뒤로가기 클릭 시 파일 초기화 하는 함수.
  const fileInitial:MainIprops["fileInitial"] = function() {
    setMusicFileName(null);
    if (on) {
      setOn(!on);
    }
  }

  return (
    <div className="App">
      <Nav player={player} fileInitial={fileInitial} source={source} album={album} num={num} nextNum={nextNum} music={music} />
      <Route exact path="/">
        <Login login={login} account={account} onChange={onChange} />
      </Route>
      <Route path="/signup">
        <SignUp
         createUser={createUser}
         account={account}
          onChange={onChange}
        />
      </Route>
      <Route path="/main">
        <Main fileInitial={fileInitial}
          source={source} 
          player={player} 
          album={album} 
          num={num} 
          nextNum={nextNum} 
          music={music} />
        <Actions playTheMusic={playTheMusic} pauseTheMusic={pauseTheMusic} changeAlbum={changeAlbum} changeMusic={changeMusic} />
      </Route>

      <Route exact path="/setting">
        <Setting logout={logOut} />
      </Route>

      {/* setting */}
      <Route path="/setting/version">
        <Version />
      </Route>
      <Route path="/setting/playlist/:id">
        <AlbumEdit album={album} music={music}/>
      </Route>
      <Route path="/setting/addmusic/:id">
        <AddMusic music={music} />
      </Route>
      <Route path="/setting/musiclist">
        <MusicList
          fileRef={fileRef}
          onChangeMusic={onChangeMusic}
          upLoadMusic={upLoadMusic}
          on={on}
          music={music}
          removeModal={removeModal}
          removeMusic={removeMusic}
          musicFileName={musicFileName}
        />
      </Route>
      <Route path="/setting/addalbum">
        <AddAlbum album={album} onChangeAlbum={onChangeAlbum} addAlbumState={addAlbumState} addAlbum={addAlbum} />
      </Route>
    </div>
  );
}

// Nav Components
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
      title: "버전정보",
      site: "/setting/version",
    },
    {
      id: 3,
      title: "앨범",
      site: "/setting/playlist",
    },
    {
      id: 4,
      title: "앨범편집",
      site: "/setting/playlist/:id",
    },
    {
      id: 5,
      title: "곡 리스트",
      site: "/setting/musiclist",
    },
    {
      id: 6,
      title: "앨범노래추가",
      site: "/setting/addmusic/:id",
    },
    {
      id: 7,
      title: "앨범추가",
      site: "/setting/addalbum",
    }
  ]);
  return (
    <div id="nav">
      {navList.map((navList) => {
        return (
          <Route exact path={navList.site}>
            <div style={{ width: '20px' }}>

            { navList.site === '/main' ? null:<i
              onClick={() => {
                if (navList.site === '/setting/musiclist') {
                  props.fileInitial();
                }
                history.goBack();
              }}
              className="fas fa-chevron-left"
              ></i>}
              </div>
            <span>
              {navList.site === "/main"
                ? (navList.title = props.album[props.num].title)
                : navList.title}
            </span>
            <div style={{ width: '20px' }}>

            {navList.site === "/main" ?
              <i
              onClick={() => {
                history.push("/setting");
              }}
              className="fas fa-cog edits"
              ></i>  : ( navList.site === "/setting/playlist/:id" ? <p className="edits">완료</p> : null)}
                  </div>
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
              props.pauseTheMusic();
              // 누르면 오디오 플레이 버튼 조작하기.
            }}
            className="fas fa-pause play-btn pause"
          ></i>
        ) : (
          <i
            onClick={() => {
              setPlay(!play);
              props.playTheMusic();
            }}
            className="fas fa-play play-btn play"
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
