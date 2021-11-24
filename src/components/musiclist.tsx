import "../styles/musiclist.scss";
import { MusicListIprops } from "../App";

const MusicList: React.FC<MusicListIprops> = function (props): JSX.Element {
  return (
    <div id="music-list">
      {props.music.map(({ title, singer }) => {
        return (
          <section className="item">
            <div className="sing-info">
              <div className="image"></div>
              <div>
                <p>{title}</p>
                <span>{singer}</span>
              </div>
            </div>
            <i className="fas fa-minus remove-btn"></i>
          </section>
        );
      })}

      <label id="label" htmlFor="music-file">
        <i className="fas fa-plus plus-music"></i>
      </label>
      <i
        style={{ display: props.on ? "block" : "none" }}
        className="fas fa-check plus-music"
        onClick={() => {
          props.upLoadMusic();
        }}
      ></i>
      <input type="file" onChange={props.onChangeMusic} id="music-file" />
    </div>
  );
};
export default MusicList;
