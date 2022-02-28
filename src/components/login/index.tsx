import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { LoginIprops } from "../../types";
import firebase from "../../firebase";
import onChange from "../../controller/onChange";
import loginFn from "../../controller/login";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { LoginInputType } from "../../types";
import "./style.scss";
const StyledLink = styled(Link)`
    test-decoration: none;
    color: black;
`;

const Login: React.FC<LoginIprops> = function (props): JSX.Element {
    const dispatch = useDispatch();
    const [login, setLogin] = useState<LoginInputType>({
        email: "",
        password: "",
    });
    const history = useHistory();
    return (
        <div id="login">
            <section className="login-form">
                <h1>Cliche</h1>
                <input
                    type="text"
                    name="email"
                    onChange={(e) => onChange(e, login, setLogin)}
                    id="id"
                    placeholder="ID or Email"
                />
                <input
                    type="password"
                    name="password"
                    onChange={(e) => onChange(e, login, setLogin)}
                    id="password"
                    placeholder="Password"
                />
                <button
                    onClick={() => {
                        loginFn(login, props.setMusic, dispatch);
                        setLogin({ email: "", password: "" });
                        history.push("/main");
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
