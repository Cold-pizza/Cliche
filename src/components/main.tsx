import "../styles/main.scss";
import { MainIprops } from "../App";

const Main: React.FC<MainIprops> = function (props): JSX.Element {
  return (
    <div id="main">
      <section className="display-music">
        <div className="picture">앨범을 선택해 주세요!</div>
        <span className="title">
          {props.album[props.num].playList[props.nextNum].title}
        </span>
        <span className="singer">
          {props.album[props.num].playList[props.nextNum].singer}
        </span>
      </section>
      <audio controls className="music-player">
        <source
          type="audio/mp3"
          src="https://firebasestorage.googleapis.com/v0/b/cilche-prototype.appspot.com/o/music%2FGlen%20Check-84.mp3?alt=media&token=c02e6ed7-ae05-4eb7-824b-15563fd8bc38"
        />
      </audio>
    </div>
  );
};

export default Main;
