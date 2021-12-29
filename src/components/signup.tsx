import { SignUpIprops } from "../App";
import React from "react";
import { useHistory } from "react-router-dom";

import "../styles/signup.scss";

const SignUp: React.FC<SignUpIprops> = function (props): JSX.Element {
  const email = props.account.email;
  const password = props.account.password;
  const history = useHistory();

  return (
    <div id="sign-up">
      <h1>회원가입</h1>
      <form>
        <input
          type="text"
          name="email"
          value={email}
          onChange={props.onChange}
          id="id"
          placeholder="Email"
        />
        <input
          type="text"
          name="password"
          value={password}
          onChange={props.onChange}
          id="password"
          placeholder="PASSWORD"
        />
        <button
          onClick={() => {
            props.createUser(email, password);
            alert('가입 성공')
            history.push('/');
          }}
          className="signup-btn"
        >
          가입하기
        </button>
        <button
          onClick={() => {
            history.replace("/");
          }}
          className="cancel-btn"
        >
          취소
        </button>
      </form>
      <div className="other-signup"></div>
    </div>
  );
};

export default SignUp;
