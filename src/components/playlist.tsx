import "../styles/playlist.scss";

import { PlayListIprops } from "../App";

const PlayList: React.FC<PlayListIprops> = function (props): JSX.Element {
  return (
    <div id="playlist">
      {props.album.map(({ id, title, info, active }) => {
        return (
          <section className="item">
            <div className="album-info">
              <i className="fas fa-record-vinyl lp"></i>
              <div className="meta-info">
                <span className="title">{title}</span>
                <span className="info">{info}</span>
              </div>
            </div>
            <i
              onClick={() => {
                props.onModal(id);
              }}
              className="fas fa-ellipsis-v more-btn"
            ></i>
            {active === true ? (
              <div className="modal">
                <p>편집</p>
                <p>제거</p>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
};

export default PlayList;
