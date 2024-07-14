import styled from "styled-components";
import { logFirebase } from "../../features/log-firebase-interaction";
import { onSnapshot, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import LogoRef from "../../images/NewLogo.png";
import LogOutRef from "../../images/LogOut.svg";
import { useNavigate } from "react-router-dom";
import { loginUtils } from "../../features/login-feature";
import Loading from "../../components/loading";
import {
  MINSAPAY_TITLE,
  BACKGROUND_GRAY,
} from "../../components/theme-definition";




import styled from "styled-components";
import GoHomeRef from "../../images/CPUHome.svg";
import { useNavigate } from "react-router-dom";
import { loginUtils } from "../../features/login-feature";

// CPU의 모든 화면에 공통으로 들어가는 header으로, home으로 가는, logout하는 버튼을 가지고 있다.

const HeaderDiv = styled.div`
  width: 95%;
  margin: 0 auto;
  height: 10vh;
  padding: 0 2.5%;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
const LogOutIcon = styled.img`
  height: 70%;
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

const LogHeader = () => {
  const navigate = useNavigate();
  const onLogoClick = (e) => {
    // logo 누르면 홈으로 navigate
    e.preventDefault();
    navigate("/");
  };
  const onLogOutIconClick = async (e) => {
    // logout 누르면 confirm 띄우고 로그아웃 후 home으로 navigate --> 저절로 logout화면으로 protected routes를 통해 연결
    e.preventDefault();
    if (!confirm("로그아웃 하시겠습니까?")) return;
    await loginUtils.signOut();
    navigate("/login");
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
        <LogOutIcon onClick={onLogOutIconClick} src={LogOutRef} />
      </IconWrapper>
    </HeaderDiv>
  );
};



const Wrapper = styled.div`
  width: 100vw;
  height: flex;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  position: relative;
  background-color: ${BACKGROUND_GRAY};
`;

const Table = styled.table`
  width: 90%;
  max-width: 800px;
  margin-bottom: 50px;
  border-collapse: collapse;
  background-color: #ffffff;
  border: 1px solid #ccc;
`;

const Th = styled.th`
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #1c4664;
  color: white;
  font-size: 14px;
`;
const Td = styled.td`
  padding: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
  text-align: center; /* 텍스트 가운데 정렬 */
  vertical-align: middle; /* 세로 가운데 정렬 */
`;

const TitleEl = styled.div`
  font-size: 30px;
  font-family: ${MINSAPAY_TITLE};
  padding: calc(40px + 10vh) 0 40px 0;
`;


export default function LogHome() {
  const [log, setLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let unsubscribe = null;
    const init = async () => {
      setIsLoading(true);
      await logFirebase.init();
      setLog((await getDoc(logFirebase.logRef)).data().log.toReversed());
      setIsLoading(false);
    };
    init();
    unsubscribe = onSnapshot(logFirebase.logRef, (snapshot) => {
      setLog(snapshot.data().log.toReversed());
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <Wrapper>
      <LogHeader />
      <TitleEl>Log</TitleEl>
      <Table>
        <thead>
          <tr>
            <Th>거래시간</Th>
            <Th>보낸사람</Th>
            <Th>받은사람</Th>
            <Th>거래액</Th>
          </tr>
        </thead>
        <tbody>
          {log.map((logEl, index) => (
            <tr key={index}>
              <Td>{logEl.time}</Td>
              <Td>{logEl.sender}</Td>
              <Td>{logEl.reciever}</Td>
              <Td>{logEl.amount}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
}
