import "./style.scss";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { SettingIprops } from "../../types";

const Setting: React.FC<SettingIprops> = function (props): JSX.Element {
    const history = useHistory();
    const [isBtn, setIsBtn] = useState(false);
    return (
        <div id="setting">
            <ul>
                <li
                    onClick={() => {
                        history.push("/setting/musiclist");
                    }}
                >
                    곡정보
                </li>
                <li
                    onClick={() => {
                        setIsBtn(!isBtn);
                    }}
                >
                    로그아웃
                </li>
            </ul>
            {isBtn === true ? (
                <div className="logout-form">
                    <p>로그아웃 하시겠습니까?</p>
                    <div className="btns">
                        <button
                            onClick={() => {
                                props.logout();
                            }}
                            className="yes"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => {
                                setIsBtn(!isBtn);
                            }}
                            className="no"
                        >
                            No
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Setting;
