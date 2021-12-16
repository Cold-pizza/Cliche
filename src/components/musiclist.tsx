import "../styles/musiclist.scss";
import { MusicListIprops } from "../App";
import { useState } from "react";

const MusicList: React.FC<MusicListIprops> = function (props): JSX.Element {
  const [isBtn, setIsBtn] = useState(true);
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
      { isBtn ? <div className="panel">
      <i className="fas fa-times x" onClick={() => {
        setIsBtn(!isBtn);
      }} ></i>
        <p>제목을 <span>"가수이름"-"노래제목"</span>으로된 파일을 업로드해주세요!</p>
      </div> : null}
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
