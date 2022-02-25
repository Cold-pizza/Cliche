const onChange:(e:React.ChangeEvent<HTMLInputElement>, state: null | {}, setState:any) => void = function (e, state, setState) {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  export default onChange