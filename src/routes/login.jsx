import { useState } from "react";
import { loginUtils } from "../features/login-feature";
import styled from "styled-components";
import Logo from "../images/NewLogo.png";
import { useNavigate } from "react-router-dom";
import {
  BORDER_GRAY,
  BUTTON_SHADOW,
  MINSAPAY_BLUE,
  MINSAPAY_FONT,
  MINSAPAY_TITLE,
} from "../components/theme-definition";
import backgroundImagePhoneScreen from "../images/bg-candidate-phone-screen.png";
import backgroundImageWideScreen from "../images/bg-candidate-wide-screen.jpg";
import Loading from "../components/loading";

const OuterWrapper = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${backgroundImageWideScreen});
  background-size: cover;
  @media only screen and (max-width: 768px) {
    background-image: url(${backgroundImagePhoneScreen});
    background-size: cover;
  }
`;

const Wrapper = styled.div`
  width: 50vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    width: 100%;
    height: 100%;
    justify-content: flex-start;
    padding-top: 20px;
  }
`;

const LoginBox = styled.div`
  height: 70vh;
  @media only screen and (max-width: 1000px) {
    height: 45vh;
  }
  width: 100%;
  @media only screen and (max-width: 1000px) {
    width: 35vh;
  }
  background-color: white;
  border-radius: 5vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  @media only screen and (max-width: 768px) {
    padding: 10px 0;
  }
`;

const TitleDiv = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
  @media only screen and (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Title = styled.span`
  font-size: 2vw;
  @media only screen and (max-width: 1100px) {
    font-size: calc(0.3vw + 1.5em);
  }
  font-family: ${MINSAPAY_TITLE};
  margin-top: 20px;
`;

const ImgDiv = styled.div`
  height: 140%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 10%;
  margin-top: 10%;
  @media only screen and (max-width: 768px) {
    height: auto;
    margin-bottom: 5%;
    margin-top: 5%;
  }
`;

const Image = styled.img`
  height: 220%;
  margin-top: 10%;
  @media only screen and (max-width: 768px) {
    height: 100px;
    margin-top: 0;
  }
`;

const Form = styled.form`
  height: 50%;
  padding-top: 20%;
  margin-bottom: 1.6%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-family: ${MINSAPAY_FONT};
  @media only screen and (max-width: 768px) {
    padding-top: 10%;
    height: auto;
    margin-bottom: 0;
  }
`;

const Input = styled.input`
  padding: 1.3% 0px;
  border: none;
  width: 80%;
  font-size: 1vh;
  @media only screen and (max-width: 700px) {
    font-size: 1.5vh;
  }
  outline: none;
  border-bottom: 3px solid ${BORDER_GRAY};
  margin-top: 7%;
  font-family: ${MINSAPAY_FONT};
  @media only screen and (max-width: 2000px) {
    font-size: 0.9em;
  }
  &:focus {
    border-bottom: 3px solid #444;
  }
  &[name="password"] {
    font-family: sans-serif;
    &::placeholder {
      font-family: ${MINSAPAY_FONT};
    }
  }
  &[type="submit"] {
    margin-top: 7%;
    margin-bottom: 0px;
    width: 30%;
    height: 17%;
    border-radius: 50px;
    border-bottom: 0px;
    background-color: ${MINSAPAY_BLUE};
    color: white;
    font-size: 0.7em;
    @media only screen and (max-width: 700px) {
      font-size: calc(0.07vw + 0.78em);
    }
    font-weight: normal;
    font-family: ${MINSAPAY_FONT};
    &:hover {
      cursor: pointer;
      opacity: 0.8;
      box-shadow: 0px 2px 2px 0px ${BUTTON_SHADOW};
    }
  }
`;

const Error = styled.span`
  font-size: 1.3vh;
  @media only screen and (max-width: 1000px) {
    font-size: calc(0.58em);
  }
  color: tomato;
  font-family: ${MINSAPAY_FONT};
  margin-bottom: 7%;
  @media only screen and (max-width: 1000px) {
    margin-bottom: 5%;
  }
`;

const PicSource = styled.span`
  font-size: 2vh;
  @media only screen and (max-width: 1000px) {
    font-size: 1.5vh;
  }
  color: aliceblue;
  font-family: ${MINSAPAY_FONT};
  position: fixed;
  bottom: 1%;
  @media only screen and (max-width: 1000px) {
    bottom: 3%;
  }
  left: 1%;
  @media only screen and (max-width: 1000px) {
    left: 3%;
  }
`;

export default function Login() {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (userID === "" || password === "") return;
    setIsLoading(true);
    const successfulSignIn = await loginUtils.signIn(userID, password);
    setIsLoading(false);
    if (successfulSignIn) {
      navigate("/");
    } else if (loginUtils.error === "") setError("이유불명 로그인 에러");
    else setError(loginUtils.error);
  };
  const onLogoImageDoubleClick = async () => {
    const userID = prompt("아이디 입력");
    if (userID !== "Admin@developer") return;
    const password = prompt("비밀번호 입력");
    const successfulSignIn = await loginUtils.developerSignIn(password);
    if (successfulSignIn) {
      navigate("/");
    }
  };
  return isLoading ? (
    <Loading />
  ) : (
    <OuterWrapper>
      <Wrapper>
        <LoginBox>
          <TitleDiv>
            <ImgDiv>
              <Image src={Logo} onDoubleClick={onLogoImageDoubleClick} />
            </ImgDiv>
            <Title>Login</Title>
          </TitleDiv>
          <Form onSubmit={onSubmit}>
            <Input
              onChange={(e) => setUserID(e.target.value)}
              value={userID}
              name="UserID"
              placeholder="Student ID"
              type="text"
              required
            />
            <Input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
              placeholder="Password"
              type="password"
              required
            />
            <Input type="submit" value={"로그인"} />
          </Form>
          {error !== "" ? <Error>{error}</Error> : null}
        </LoginBox>
      </Wrapper>
      <PicSource>
        총괄 및 개발 2024 과학기술부 & 사진 제공 TTL & 로고 제공 28기 정윤홍
      </PicSource>
    </OuterWrapper>
  );
}
