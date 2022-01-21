import React, { useState } from 'react';
import { useHistory, Route } from 'react-router-dom';
import { MainIprops } from '../../types';
import './style.scss';

const Nav: React.FC<MainIprops> = function (props): JSX.Element {
    const history = useHistory();
    const [navList, setNavList] = useState([
      {
        id: 0,
        title: "",
        site: "/main",
      },
      {
        id: 1,
        title: "설정",
        site: "/setting",
      },
   
      {
        id: 2,
        title: "버전정보",
        site: "/setting/version",
      },
      {
        id: 3,
        title: "앨범",
        site: "/setting/playlist",
      },
      {
        id: 4,
        title: "앨범편집",
        site: "/setting/playlist/:id",
      },
      {
        id: 5,
        title: "곡 리스트",
        site: "/setting/musiclist",
      },
      {
        id: 6,
        title: "앨범노래추가",
        site: "/setting/addmusic/:id",
      },
      {
        id: 7,
        title: "앨범추가",
        site: "/setting/addalbum",
      }
    ]);
    return (
      <div id="nav">
        {navList.map((navList) => {
          return (
            <Route exact path={navList.site}>
              <div style={{ width: '20px' }}>
  
              { navList.site === '/main' ? null:<i
                onClick={() => {
                  if (navList.site === '/setting/musiclist') {
                    props.fileInitial();
                  }
                  history.goBack();
                }}
                className="fas fa-chevron-left"
                ></i>}
                </div>
              <span>
                Cliche
                {/* {navList.site === "/main"
                  ? (navList.title = props.album[props.num].title)
                  : navList.title} */}
              </span>
              <div style={{ width: '20px' }}>
  
              {navList.site === "/main" ?
                <i
                onClick={() => {
                  history.push("/setting");
                }}
                className="fas fa-cog edits"
                ></i>  : ( navList.site === "/setting/playlist/:id" ? <p className="edits">완료</p> : null)}
                    </div>
            </Route>
          );
        })}
      </div>
    );
  };
  
  export default Nav;