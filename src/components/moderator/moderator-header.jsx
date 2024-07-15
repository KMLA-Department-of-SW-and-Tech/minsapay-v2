import styled from "styled-components";
import LogoRef from "../../images/NewLogo.png";
import LogIconRef from "../../images/LogIcon.svg";
import GoHomeRef from "../../images/CPUHome.svg";
import { useNavigate } from "react-router-dom";
import SettingRef from "../../images/Setting.svg";


// CPU의 모든 화면에 공통으로 들어가는 header으로, home으로 가는, logout하는 버튼을 가지고 있다.

const HeaderDiv = styled.div`
  width: 95%;
  margin: 0 0;
  height: 10vh;
  padding: 0 2.5%;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 다른 요소 위에 표시되도록 z-index 설정 */
`;
const Logo = styled.img`
  height: 90%;
  /* margin-left: 11px; */
  aspect-ratio: 1;
  &:hover {
    cursor: pointer;
  }
`;
const IconWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 50%;
  height: 100%;
`;
const SettingIcon = styled.img`
  height: 60%;
  /* margin-right: 11px; */
  aspect-ratio: 1;
  /* margin-left: auto; */
  &:hover {
    cursor: pointer;
  }
`;
const LogIcon = styled.img`
  height: 70%;
  /* margin-right: 11px; */
  aspect-ratio: 1;
  /* margin-left: auto; */
  &:hover {
    cursor: pointer;
  }
`;

const ModeratorHeader = ({logButtonEnable}) => {
  const navigate = useNavigate();
  const onLogoClick = (e) => {
    // logo 누르면 홈으로 navigate
    e.preventDefault();
    navigate("/");
  };
  const onLogIconClick = async (e) => {
    e.preventDefault();
    navigate("/log");
  };
  const onSettingClick = async (e) => {
    // logo 누르면 설정으로 navigate
    e.preventDefault();
    navigate("/login-setting");
  };
  const onLogoHover = (e) => {
    const logoImage = e.target;
    logoImage.src = GoHomeRef;
  };
  const onLogoLeave = (e) => {
    const logoImage = e.target;
    logoImage.src = LogoRef;
  }; // logo에 hover하면 이미지가 바뀌도록

  return (
    <HeaderDiv>
      <Logo
        onClick={onLogoClick}
        onMouseOver={onLogoHover}
        onMouseLeave={onLogoLeave}
        src={LogoRef}
      />
      <IconWrapper>
        {logButtonEnable ? <LogIcon onClick={onLogIconClick} src={LogIconRef} /> : null}
        <SettingIcon onClick={onSettingClick} src={SettingRef} />
      </IconWrapper>
    </HeaderDiv>
  );
};

export { ModeratorHeader };
