import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { LoginIprops } from "../../types";
import firebase from "../../firebase";
import onChange from '../../controller/onChange';
import styled from "styled-components";
import "./style.scss";
const StyledLink = styled(Link)`
  test-decoration: none;
  color: black;
`;
type LoginType = {
  email: string,
  password: string
};

const Login: React.FC<LoginIprops> = function (props): JSX.Element {
  const [login, setLogin] = useState<LoginType>({ email: '', password: '' });
  return (
    <div id="login">
      <section className="login-form">
        <h1>Cliche</h1>
        <input
          type="text"
          name="email"
          onChange={e => onChange(e, login, setLogin)}
          id="id"
          placeholder="ID or Email"
        />
        <input
          type="password"
          name="password"
          onChange={e => onChange(e, login, setLogin)}
          id="password"
          placeholder="Password"
        />
        <button
          onClick={() => {
            props.login(login);
            setLogin({email: '', password: ''});
          }}
          className="login-btn"
        >
          로그인
        </button>
        <StyledLink to="/signup">
          <button className="signup-btn">회원가입</button>
        </StyledLink>
      </section>
    </div>
  );
};

export default Login;
