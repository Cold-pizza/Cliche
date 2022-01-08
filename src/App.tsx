import React, { useState, useRef } from "react";
import "./App.scss";
import { Route, withRouter, useHistory } from "react-router-dom";
import firebase from "./firebase";

// import Component
import SignUp from "./components/signup";
import Login from "./components/login";
import Main from "./components/main";
import Setting from "./components/setting";
import MusicList from "./components/musiclist";
import AddMusic from "./components/addMusic";

import { DocumentData } from "@google-cloud/firestore";

//useState type
type AccountType = {
  email: string;
  password: string;
};
type MusicType = {
  id: number;
  title: string;
  singer: string;
  url: string;
  active: boolean;
}[];
type AnyType = any;

type MusicImg = string[];

// 함수 type
type OnChangeType = (e: React.ChangeEvent<HTMLInputElement>) => void;
type CreateUserType = (email: string, password: string) => void;
type LoginType = (email: string, password: string) => void;
type LogOutType = () => void;
type OnModalType = (id: number) => void;
type UpLoadingType = () => void;
type PlayTheMusicType = () => void;
type PauseTheMusicType = () => void;

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
  onModal: OnModalType;
}

// export main.tsx
export interface MainIprops {
  num: number;
  nextNum: number;
  music: MusicType;
  player: AnyType;
  source: AnyType;
  fileInitial: ()=> void;
  musicImg: MusicImg;
}

// Action 컴포넌트 컨트롤러 type
export interface ActionIprops {
  changeMusic: {
    nextMusic: () => void;
    beforeMusic: () => void;
  };
  playTheMusic: PlayTheMusicType;
  pauseTheMusic: PauseTheMusicType;
  volControl: (vol: string) => void;
  musicControl: () => void;
  keyDownMusic: () => void;
  play: boolean;
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
  musicImg: MusicImg;
}

// setting.tsx
export interface SettingIprops {
  logout: LogOutType;
}

// addMusic.tsx
export interface AddMusicIprops {
  music: MusicType;
}

// App Component
function App() {
  const history = useHistory();
  const [account, setAccount] = useState<AccountType>({ email: "", password: "" });

  // input.value를 account state에 저장.
  const onChange: SignUpIprops["onChange"] = function (e) {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  // 계정만드는 함수❗️.
  const createUser: SignUpIprops["createUser"] = function (email, password) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        setAccount({ email: "", password: "" });
      })
      .catch(() => {
        alert("가입 실패");
      });
  };

  // 노래 앨범 이미지.
  const [musicImg, setMusicImg] = useState<MusicImg>([
    'https://github.com/cold-pizza/cliche/blob/master/public/images/youth!.jpg?raw=true', 
  'https://github.com/cold-pizza/cliche/blob/master/public/images/youth!.jpg?raw=true', 
  'https://github.com/cold-pizza/cliche/blob/master/public/images/humidifier.jpg?raw=true']);

  // firebase에서 음악 받아온 보관소.
  const [music, setMusic] = useState<MusicType>([]);

  // 로그인 함수.
  const login: LoginIprops["login"] = function (email, password) {
     firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (res) => {
        console.log(res)
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
      .then((res) => {
        console.log(res)
        console.log("로그아웃 하셨습니다.");
        setOn(!on);
        history.replace("/");
      });
  };


  // Main 컴포넌트 Action 버튼 조절 state.
  let [num, setNum] = useState<MainIprops["num"]>(0);
  let [nextNum, setNextNum] = useState<MainIprops["nextNum"]>(0);

  // Music state 제거 모달 함수.
  const removeModal:MusicListIprops['removeModal'] = function(id) {
    setMusic(
      music.map((list)=> {
        return list.id === id ? { ...list, active: !list.active } : list;
      })
    )
  }

  // 노래 삭제 함수.
  const removeMusic:MusicListIprops['removeMusic'] = function(id) {
    const db = firebase.firestore().collection('playList');
    const uid:string = music[id].singer+'-'+music[id].title;
    if (music[id].active) {
      db.doc(uid).delete().then(()=>{
        console.log('success delete!');
      }).catch(()=>{
        console.log('something wrong');
      })
      }
  }

  // 다음곡, 이전곡 버튼기능.
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

  // 음악 볼륨 설정 함수.
  const volControl:ActionIprops['volControl'] = function(vol) {
    if (vol === 'up' && player.current.volume < 1) {
    player.current.volume  += 0.1;
    console.log(player.current.volume);
  } else if (vol === 'down' && player.current.volume > 0.11) {
      player.current.volume -= 0.1;
      console.log(player.current.volume);
  } else {
    alert('최대 입니다.')
    return false;
  }
  }

  // 재생, 정지 아이콘.
  const [play, setPlay] = useState<ActionIprops['play']>(false);

  const musicControl = function() {
    setPlay(!play);
  }

  // Action 컴포넌트 컨트롤러 플레이 함수.
  const playTheMusic: PlayTheMusicType = function() {
    // player.current.load();
    player.current.play();

  }
  const pauseTheMusic: PauseTheMusicType = function() {
    // player.current.load();
    player.current.pause();
  }
    
  const keyDownMusic: ActionIprops['keyDownMusic'] = function() {
    const e:KeyboardEvent = window.event as KeyboardEvent;
    if (e.key === 'Enter') {
      setPlay(!play); 
      if (play === true) {
        player.current.play();
      }
      if (play === false) {
        player.current.pause();
      }
    }
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

  // 음악 id.
  let [nextId, setNextId] = useState<number>(0);

  // 🎵노래 업로드 기능🎵.(firestore에 text로 저장하기)
  const upLoadMusic: UpLoadingType = function () {
    const storageRef = storage.ref();
    const downLoadPath = storageRef.child("music/" + musicFile.name);
    const upLoading = downLoadPath.put(musicFile);
    upLoading.on(
      "state_changed",
      // 변화할 때, 동작하는 함수.
      (loading) => {
        console.log("로딩중..", loading);
      },
      //에러시 동작하는 함수.
      (error) => {
        console.log("실패사유: ", error);
      },
      // 성공시 동작하는 함수.
      () => {
        upLoading.snapshot.ref.getDownloadURL().then((url) => {
          console.log("업로드 성공!");
          setMusicFileName(null);
          setOn(!on);
          let musicName = musicFile.name.split('-')[1];
          // firestore에 text로 저장.
          const db = firebase.firestore();
          db.collection("playList")
            .doc(musicFile.name)
            .set({
              title: musicName.split('.')[0],
              singer: musicFile.name.split("-")[0],
              url: url,
              active: false,
              id: nextId,
            });
        });
        setNextId(nextId + 1);
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
      <Nav musicImg={musicImg} player={player} fileInitial={fileInitial} source={source} num={num} nextNum={nextNum} music={music} />
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
        <Main 
        fileInitial={fileInitial}
        musicImg={musicImg}
          source={source} 
          player={player} 
          num={num} 
          nextNum={nextNum} 
          music={music} />
        <Actions 
        play={play}
        musicControl={musicControl}
        playTheMusic={playTheMusic} 
        pauseTheMusic={pauseTheMusic} 
        changeMusic={changeMusic}
        volControl={volControl}
        keyDownMusic={keyDownMusic}
         />
      </Route>

      <Route exact path="/setting">
        <Setting logout={logOut} />
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
          musicImg={musicImg}
        />
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
              Cliche
              {/* {navList.site === "/main"
                ? (navList.title = props.album[props.num].title)
                : navList.title} */}
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
  const up:string = 'up';
  const down:string = 'down';
  
  return (
    <div id="actions">
      <section className="up-btn">
        <i
          onClick={() => {
            props.volControl(up);
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
        {props.play ? (
          <i
            onClick={() => {
              props.musicControl();
              props.pauseTheMusic();
              // 누르면 오디오 플레이 버튼 조작하기.
            }}
            className="fas fa-pause play-btn pause"
          ></i>
        ) : (
          <i
            onClick={() => {
              props.musicControl();
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
            props.volControl(down);
          }}
          className="fas fa-chevron-down"
        ></i>
      </section>
    </div>
  );
};

export default withRouter(App);
