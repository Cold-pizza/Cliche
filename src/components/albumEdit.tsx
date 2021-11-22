import "../styles/albumEdit.scss";
import { useParams } from "react-router-dom";
import { AlbumEditIprops } from "../App";

const AlbumEdit: React.FC<AlbumEditIprops> = function (props): JSX.Element {
  const { id } = useParams<{ id: string | undefined }>();
  const ids = Number(id);
  return (
    <div id="albumEdit">
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
      <i className="fas fa-plus plus-album"></i>
    </div>
  );
};

export default AlbumEdit;
