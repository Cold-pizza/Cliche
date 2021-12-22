import "../styles/main.scss";
import { useEffect } from "react";
import { MainIprops } from "../App";


const Main: React.FC<MainIprops> = function (props): JSX.Element {

  // 다음 곡, 이전 곡 누를 때마다 audio src 변경.
    useEffect(()=>{
      if (props.music.length !== 0) {
        props.source.current.src = props.music[props.nextNum].url;
      }
  })
  // console.log(props.player.controls);
  // console.log(props.player.current.duration);
  return (
    <div id="main">
      <section className="display-music">
        <div className="picture">앨범을 선택해 주세요!</div>
        <span className="title">
          { props.music.length === 0 ? null : props.music[props.nextNum].title }
        </span>
        <span className="singer">
          { props.music.length === 0 ? null : props.music[props.nextNum].singer }
        </span>
      </section>
      <div className="time-line">
        <p className="current-time">0</p>
        <p className="duration">0</p>
      </div>
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
