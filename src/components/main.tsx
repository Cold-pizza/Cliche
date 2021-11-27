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
          src={props.music[1].url}
        />
      </audio>
    </div>
  );
};

export default Main;
