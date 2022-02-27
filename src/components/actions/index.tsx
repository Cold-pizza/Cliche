import React from "react";
import { ActionIprops } from "../../types";
import "./style.scss";

const Actions: React.FC<ActionIprops> = function (props): JSX.Element {
    const up: string = "up";
    const down: string = "down";

    return (
        <div id="actions">
            <section className="up-btn">
                <i
                    onClick={() => {
                        props.volControl(up);
                    }}
                    className="fas fa-chevron-up"
                ></i>
            </section>
            <section className="middle-btn">
                <i
                    onClick={() => {
                        props.changeMusic.beforeMusic();
                    }}
                    className="fas fa-chevron-left"
                ></i>
                {props.play ? (
                    <i
                        onClick={() => {
                            props.musicControl();
                            props.pauseTheMusic();
                            // 누르면 오디오 플레이 버튼 조작하기.
                        }}
                        className="fas fa-pause play-btn pause"
                    ></i>
                ) : (
                    <i
                        onClick={() => {
                            props.musicControl();
                            props.playTheMusic();
                        }}
                        className="fas fa-play play-btn play"
                    ></i>
                )}

                <i
                    onClick={() => {
                        props.changeMusic.nextMusic();
                    }}
                    className="fas fa-chevron-right"
                ></i>
            </section>
            <section className="bottom-btn">
                <i
                    onClick={() => {
                        props.volControl(down);
                    }}
                    className="fas fa-chevron-down"
                ></i>
            </section>
        </div>
    );
};

export default Actions;
