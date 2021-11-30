
import "../styles/addAlbum.scss";
import { useHistory } from "react-router-dom";
import { AddAlbumIprops } from "../App";

const AddAlbum:React.FC<AddAlbumIprops> = function(props):JSX.Element {
    const history = useHistory();

    return <div id="add-album">
        <div className="album-form">
        <i className="fas fa-record-vinyl lp"></i>
        <div className="input-form">
        <input type="text" value={props.addAlbumState.name} name="name" onChange={props.onChangeAlbum} placeholder="앨범제목"/>
        <span>{props.addAlbumState.name}</span>
        </div>
        </div>
        <i onClick={()=>{
            console.log('앨범 생성!')
            props.addAlbum();
            history.push("/setting/playlist")
        }} className="fas fa-check check-box"></i>
    </div>
}

export default AddAlbum;