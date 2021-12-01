import "../styles/albumEdit.scss";
import { useParams, useHistory } from "react-router-dom";
import { AlbumEditIprops } from "../App";

const AlbumEdit: React.FC<AlbumEditIprops> = function (props): JSX.Element {
  const history = useHistory();
  const { id } = useParams<{ id: string | undefined }>();
  const ids = Number(id);
  return (
    <div id="album-edit">
      <header>
        <i className="fas fa-record-vinyl"></i>
        <div className="album-info">
          <span>{props.album[ids].title}</span>
          <input
            className="album-name"
            type="text"
            placeholder={props.album[ids].title}
          />
        </div>
      </header>
      <section className="music-list">
        {props.album[ids].playList.map((playList) => {
          return (
            <section className="item">
              <div className="music-info">
                <div className="image"></div>
                <div className="meta-info">
                  <p>{playList.title}</p>
                  <span>{playList.singer}</span>
                </div>
              </div>
              <div className="edit-icons">
                <i className="fas fa-minus remove-btn"></i>
                <i className="far fa-dot-circle drag-btn"></i>
              </div>
            </section>
          );
        })}
      </section>
      <i
        onClick={() => {
          history.push(`/setting/addmusic/${id}`);
        }}
        className="fas fa-plus plus-album"
      ></i>
    </div>
  );
};

export default AlbumEdit;
