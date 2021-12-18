import "../styles/version.scss";

const Version = function () {
  return (
    <div id="version">
      <h1>*최신 버전입니다.*</h1>
      <section className="item">
        <h1>ver - 0.2.3</h1>
        <p className="path-title">버전내용</p>
        <p className="path-content">- 노래추가시 부가설명 나오게 만들었습니다.</p>
        <p className="path-content">- 곡 리스트에서 업로드 할 노래 선택해도 취소할 수 있게 만들었습니다. (뒤로가기 버튼)</p>
      </section>
      <section className="item">
        <h1>ver - 0.2.2</h1>
        <p className="path-title">버전내용</p>
        <p className="path-content">- 노래제거 기능 추가.</p>
      </section>
      <section className="item">
        <h1>ver - 0.2.1</h1>
        <p className="path-title">버전내용</p>
        <p className="path-content">- 오디오 컨트롤러 활성화.</p>
      </section>
      <section className="item">
        <h1>ver - 0.2</h1>
        <p className="path-title">버전내용</p>
        <p className="path-content">- 노래저장소 저장기능 추가.(곡정보)</p>
        <p className="path-content">- 음악재생 기능 추가.</p>
      </section>
      <section className="item">
        <h1>ver - 0.1</h1>
        <p className="path-title">버전내용</p>
        <p className="path-content">- 로그인, 회원가입 기능 추가.</p>
        <p className="path-content">- 설정란 추가.</p>
      </section>
    </div>
  );
};

export default Version;
