import "../styles/main.scss";
import {useState, useEffect, useRef} from "react";
import { useHistory } from "react-router-dom";
import { MainIprops } from "../App";
import firebase from "firebase";
import { DocumentData } from "@google-cloud/firestore";

type Item = {
  title: string;
  singer: string;
  url: string;
}[];

const Main: React.FC<MainIprops> = function (props): JSX.Element {
  const a = ["https://firebasestorage.googleapis.com/v0/b/cilche-prototype.appspot.com/o/music%2FGlen%20Check-84.mp3?alt=media&token=c02e6ed7-ae05-4eb7-824b-15563fd8bc38",
   "https://firebasestorage.googleapis.com/v0/b/cilche-prototype.appspot.com/o/music%2FGlen%20Check-Ive%20Got%20This%20Feeling.mp3?alt=media&token=08bb4ff6-3911-4326-a499-e32fde1f302a"]
  // const history = useHistory();
  const [item, setItem] = useState<Item>([]);
  useEffect(()=>{
    if (props.music !== null) {
      setItem(props.music);
    }
  }, [])
  useEffect(()=>{
    props.source.current.src = props.music[props.nextNum].url;
  }, [props.nextNum])
  
  return (
    <div id="main">
      <section className="display-music">
        <div className="picture">앨범을 선택해 주세요!</div>
        <span className="title">
          {props.music[props.nextNum].title}
        </span>
        <span className="singer">
          {props.music[props.nextNum].singer}
        </span>
      </section>
      <audio preload="auto" controls className="music-player" ref={props.player}>
        <source
        ref={props.source}
        src=""
          type="audio/mp3"
          // src="https://firebasestorage.googleapis.com/v0/b/cilche-prototype.appspot.com/o/music%2FGlen%20Check-84.mp3?alt=media&token=c02e6ed7-ae05-4eb7-824b-15563fd8bc38"
        />
      </audio>
    </div>
  );
};

export default Main;
