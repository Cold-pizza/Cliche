import { DocumentData } from "@google-cloud/firestore";
import firebase from "firebase";
import { LoginIprops } from "../types";

const login: LoginIprops["login"] = function (login, setMusic, dispatch) {
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
                setMusic(arr);
                localStorage.setItem("music", JSON.stringify(arr));
                dispatch({ type: "", payload: arr });
            }
            getMusic();
            console.log("로그인성공!");
        })
        .catch(() => {
            console.log("다시 입력해주세요.");
        });
};

export default login;
