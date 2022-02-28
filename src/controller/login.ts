import { DocumentData } from "@google-cloud/firestore";
import firebase from "firebase";
import { LoginType } from "../types";

const login: LoginType = function (login, setMusic, dispatch) {
    const { email, password } = login;
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async () => {
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
