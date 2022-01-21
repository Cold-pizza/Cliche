import "./style.scss";
import firebase from "../../firebase";
import { Link } from "react-router-dom";
import { LoginIprops } from "../../types";
import styled from "styled-components";
const StyledLink = styled(Link)`
  test-decoration: none;
  color: black;
`;

const Login: React.FC<LoginIprops> = function (props): JSX.Element {
  const email = props.account.email;
  const password = props.account.password;
  return (
    <div id="login">
      <section className="login-form">
        <h1>Cliche</h1>
        <input
          type="text"
          name="email"
          value={email}
          onChange={props.onChange}
          id="id"
          placeholder="ID or Email"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={props.onChange}
          id="password"
          placeholder="Password"
        />
        <button
          onClick={() => {
            props.login(email, password);
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
