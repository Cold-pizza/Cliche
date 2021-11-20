import "../styles/setting.scss";
import { useHistory } from "react-router-dom";

const Setting = function () {
  const history = useHistory();
  return (
    <div id="setting">
      <ul>
        <li
          onClick={() => {
            history.push("/notice");
          }}
        >
          공지사항
        </li>
        <li
          onClick={() => {
            history.push("/version");
          }}
        >
          버전정보
        </li>
        <li
          onClick={() => {
            history.push("/playlist");
          }}
        >
          앨범설정
        </li>
        <li>계정</li>
        <li>보안</li>
        <li>로그아웃</li>
      </ul>
    </div>
  );
};

export default Setting;
