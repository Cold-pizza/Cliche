import "../styles/main.scss";
import { MainIprops } from "../App";

const Main: React.FC<MainIprops> = function (props): JSX.Element {
  return (
    <div id="main">
      <section className="display-music">
        <div className="picture">앨범을 선택해 주세요!</div>
        <span className="title">
          {props.album[props.num].playList[props.num].title}
        </span>
        <span className="singer">
          {props.album[props.num].playList[props.num].singer}
        </span>
      </section>
    </div>
  );
};

export default Main;
