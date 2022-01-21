import "./style.scss";
import { useState } from "react";
import { AddMusicIprops } from "../../types";

const AddMusic: React.FC<AddMusicIprops> = function (props): JSX.Element {
  const [check, setCheck] = useState(false);
  return (
    <div id="add-music">
      {props.music.map((music) => {
        return (
          <section className="item">
            <div className="music-info">
              <div className="image"></div>
              <div>
                <p>{music.title}</p>
                <span>{music.singer}</span>
              </div>
            </div>
            <i
              style={{
                color: check === true ? "#698eff" : "rgba(0, 0, 0, 0.5)",
              }}
              className="fas fa-check check-box"
              onClick={() => {
                setCheck(!check);
              }}
            ></i>
          </section>
        );
      })}
      <i className="fas fa-check plus-music"></i>
    </div>
  );
};

export default AddMusic;
