import { useState, useRef, useEffect } from "react";
import "./App.scss";
import { Route, withRouter, useHistory } from "react-router-dom";
import firebase from "./firebase";

// import Component
import Nav from "./components/nav";
import Actions from "./components/actions";
import SignUp from "./components/signUp";
import Login from "./components/login";
import Main from "./components/main";
import Setting from "./components/setting";
import MusicList from "./components/musicList";
import AddMusic from "./components/addMusic";

import { DocumentData } from "@google-cloud/firestore";

import type {
    // interface
    LoginIprops,
    AccountType,
    SignUpIprops,
    MainIprops,
    ActionIprops,
    MusicListIprops,
    SettingIprops,
    // type
    MusicType,
    MusicImg,
    AnyType,
    PlayTheMusicType,
    PauseTheMusicType,
    OnChangeType,
    UpLoadingType,
} from "./types";

function App() {
    const history = useHistory();
    const [account, setAccount] = useState<AccountType>({
        email: "",
        password: "",
    });

    // firebase에서 음악 받아온 보관소.
    const [music, setMusic] = useState<MusicType>([]);

    useEffect(() => {
        setMusic(JSON.parse(localStorage.getItem("music")));
    }, []);

    // 음악 id.
    let [nextId, setNextId] = useState<number>(0);

    // 노래추가하면 자동으로 리스트추가.
    // 새로고침해야해서 다시 손봐야 함.
    useEffect(() => {
        async function getMusic() {
            let arr: {
                id: number;
                title: string;
                singer: string;
                url: string;
                active: boolean;
            }[] = [];
            await firebase
                .firestore()
                .collection("playList")
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc: DocumentData) => {
                        return arr.push(doc.data());
                    });
                });
            await setMusic(arr);
            await localStorage.setItem("music", JSON.stringify(arr));
        }
        getMusic();
    }, [nextId]);

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
    const musicImg: MusicImg = [
        "https://github.com/cold-pizza/cliche/blob/master/public/images/dive.jpg?raw=true",
        "https://github.com/cold-pizza/cliche/blob/master/public/images/youth!.jpg?raw=true",
        "https://github.com/cold-pizza/cliche/blob/master/public/images/youth!.jpg?raw=true",
        "https://github.com/cold-pizza/cliche/blob/master/public/images/humidifier.jpg?raw=true",
    ];

    // 로그인 함수.
    const login: LoginIprops["login"] = function (login) {
        const { email, password } = login;
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(async (res) => {
                // 로그인 성공하면 데이터 불러오는 함수.
                async function getMusic() {
                    let arr: {
                        id: number;
                        title: string;
                        singer: string;
                        url: string;
                        active: boolean;
                    }[] = [];
                    await firebase
                        .firestore()
                        .collection("playList")
                        .get()
                        .then((snapshot) => {
                            snapshot.forEach((doc: DocumentData) => {
                                return arr.push(doc.data());
                            });
                        });
                    await setMusic(arr);
                    await localStorage.setItem("music", JSON.stringify(arr));
                }
                getMusic();
                console.log("로그인성공!");
                history.push("/main");
            })
            .catch(() => {
                console.log("다시 입력해주세요.");
            });
    };

    //로그아웃 함수.
    const logOut: SettingIprops["logout"] = function () {
        firebase
            .auth()
            .signOut()
            .then((res) => {
                console.log(res);
                localStorage.clear();
                console.log("로그아웃 하셨습니다.");
                setOn(!on);
                history.replace("/");
            });
    };

    // Main 컴포넌트 Action 버튼 조절 state.
    let [num, setNum] = useState<MainIprops["num"]>(0);
    let [nextNum, setNextNum] = useState<MainIprops["nextNum"]>(0);

    // Music state 제거 모달 함수.
    const removeModal: MusicListIprops["removeModal"] = function (id) {
        setMusic(
            music.map((list) => {
                return list.id === id
                    ? { ...list, active: !list.active }
                    : list;
            })
        );
    };

    // 노래 삭제 함수.
    const removeMusic: MusicListIprops["removeMusic"] = function (id) {
        const db = firebase.firestore().collection("playList");
        const uid: string = music[id].singer + "-" + music[id].title;
        if (music[id].active) {
            db.doc(uid)
                .delete()
                .then(() => {
                    console.log("success delete!");
                })
                .catch(() => {
                    console.log("something wrong");
                });
        }
    };

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
    const volControl: ActionIprops["volControl"] = function (vol) {
        const currentVol = player.current.volume;
        if (vol === "up" && currentVol < 1) {
            let upVol = (player.current.volume += 0.1);
            console.log(upVol.toFixed(1));
        } else if (vol === "down" && currentVol > 0.11) {
            let downVol = (player.current.volume -= 0.1);
            console.log(downVol.toFixed(1));
        } else {
            alert("최대 입니다.");
            return false;
        }
    };

    // 재생, 정지 아이콘.
    const [play, setPlay] = useState<ActionIprops["play"]>(false);

    const musicControl = function () {
        setPlay(!play);
    };

    // Action 컴포넌트 컨트롤러 플레이 함수.
    const playTheMusic: PlayTheMusicType = function () {
        // player.current.load();
        player.current.play();
    };
    const pauseTheMusic: PauseTheMusicType = function () {
        // player.current.load();
        player.current.pause();
    };

    const keyDownMusic: ActionIprops["keyDownMusic"] = function () {
        const e: KeyboardEvent = window.event as KeyboardEvent;
        if (e.key === "Enter") {
            setPlay(!play);
            if (play === true) {
                player.current.play();
            }
            if (play === false) {
                player.current.pause();
            }
        }
    };

    // 음악 저장하고 체크하는 버튼state.
    const [on, setOn] = useState<MusicListIprops["on"]>(false);
    // 노래 저장하기.
    const [musicFile, setFiles] = useState(null);
    // firebase storage.
    const storage = firebase.storage();
    // 노래파일 선택 ref.
    const fileRef = useRef<MusicListIprops["fileRef"]>(null);
    // 음악파일 제목 state.
    const [musicFileName, setMusicFileName] =
        useState<MusicListIprops["musicFileName"]>("");
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
                console.log("로딩중..", loading);
            },
            //에러시 동작하는 함수.
            (error) => {
                console.log("실패사유: ", error);
            },
            // 성공시 동작하는 함수.
            async () => {
                upLoading.snapshot.ref.getDownloadURL().then((url) => {
                    console.log("업로드 성공!");
                    setMusicFileName(null);
                    setOn(!on);
                    let musicName = musicFile.name.split("-")[1];
                    // firestore에 text로 저장.
                    const db = firebase.firestore();
                    db.collection("playList")
                        .doc(musicFile.name)
                        .set({
                            title: musicName.split(".")[0],
                            singer: musicFile.name.split("-")[0],
                            url: url,
                            active: false,
                            id: music.length,
                        });
                });
                await setNextId((nextId += 1));
                await console.log(nextId);
            }
        );
    };

    // 뒤로가기 클릭 시 파일 초기화 하는 함수.
    const fileInitial: MainIprops["fileInitial"] = function () {
        setMusicFileName(null);
        if (on) {
            setOn(!on);
        }
    };

    return (
        <div className="App">
            <Nav
                musicImg={musicImg}
                player={player}
                fileInitial={fileInitial}
                source={source}
                num={num}
                nextNum={nextNum}
                music={music}
            />
            <Route exact path="/">
                <Login
                    login={login}
                    setMusic={setMusic}
                    account={account}
                    onChange={onChange}
                />
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
                    music={music}
                />
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

export default withRouter(App);
