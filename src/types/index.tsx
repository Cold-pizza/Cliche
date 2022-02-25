//useState type
export type AccountType = {
    email: string;
    password: string;
  };
export type MusicType = {
    id: number;
    title: string;
    singer: string;
    url: string;
    active: boolean;
  }[];
export  type AnyType = any;
  
export  type MusicImg = string[];
  
  // 함수 type
  export  type OnChangeType = (e: React.ChangeEvent<HTMLInputElement>) => void;
  export  type CreateUserType = (email: string, password: string) => void;
  export  type LoginType = (login: {email: string, password: string}) => void;
  export  type LogOutType = () => void;
  export  type OnModalType = (id: number) => void;
  export  type UpLoadingType = () => void;
  export  type PlayTheMusicType = () => void;
  export  type PauseTheMusicType = () => void;
  
  // export signup.tsx
  export interface SignUpIprops {
    createUser: CreateUserType;
    account: AccountType;
    onChange: OnChangeType;
  }
  
  //export login.tsx
  export interface LoginIprops {
    login: LoginType;
    account: AccountType;
    onChange: OnChangeType;
  }
  
  //export playlist.tsx
  export interface PlayListIprops {
    onModal: OnModalType;
  }
  
  // export main.tsx
  export interface MainIprops {
    num: number;
    nextNum: number;
    music: MusicType;
    player: AnyType;
    source: AnyType;
    fileInitial: ()=> void;
    musicImg: MusicImg;
  }
  
  // Action 컴포넌트 컨트롤러 type
  export interface ActionIprops {
    changeMusic: {
      nextMusic: () => void;
      beforeMusic: () => void;
    };
    playTheMusic: PlayTheMusicType;
    pauseTheMusic: PauseTheMusicType;
    volControl: (vol: string) => void;
    musicControl: () => void;
    keyDownMusic: () => void;
    play: boolean;
  }
  
  // musiclist.tsx
  export interface MusicListIprops {
    onChangeMusic: OnChangeType;
    upLoadMusic: UpLoadingType;
    on: boolean;
    music: MusicType;
    removeModal: (id:number) => void;
    removeMusic: (id:number) => void;
    fileRef: any;
    musicFileName: string;
    musicImg: MusicImg;
  }
  
  // setting.tsx
  export interface SettingIprops {
    logout: LogOutType;
  }
  
  // addMusic.tsx
  export interface AddMusicIprops {
    music: MusicType;
  }