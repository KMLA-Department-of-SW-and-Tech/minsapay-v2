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
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    width: 80%;
  }
`;

const LoginBox = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 4vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  @media only screen and (max-width: 768px) {
    padding: 15px;
  }
`;

const ImgDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Image = styled.img`
  width: 60%;
  @media only screen and (max-width: 768px) {
    width: 50%;
  }
`;

const Title = styled.span`
  font-size: 1.5em;
  font-family: ${MINSAPAY_TITLE};
  margin-bottom: 20px;
  @media only screen and (max-width: 768px) {
    font-size: 1.2em;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: ${MINSAPAY_FONT};
`;

const Input = styled.input`
  padding: 10px;
  border: none;
  width: 80%;
  font-size: 1em;
  outline: none;
  border-bottom: 2px solid ${BORDER_GRAY};
  margin-top: 10px;
  font-family: ${MINSAPAY_FONT};
  &:focus {
    border-bottom: 2px solid #444;
  }
  &[name="password"] {
    font-family: sans-serif;
    &::placeholder {
      font-family: ${MINSAPAY_FONT};
    }
  }
  &[type="submit"] {
    margin-top: 20px;
    width: 50%;
    padding: 10px;
    border-radius: 25px;
    background-color: ${MINSAPAY_BLUE};
    color: white;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.2s;
    &:hover {
      opacity: 0.8;
      box-shadow: 0px 2px 2px 0px ${BUTTON_SHADOW};
    }
    @media only screen and (max-width: 768px) {
      width: 70%;
      padding: 15px;
      font-size: 1.1em;
    }
  }
`;

const Error = styled.span`
  font-size: 0.5em;
  color: tomato;
  font-family: ${MINSAPAY_FONT};
  margin-top: 10px;
`;

const PicSource = styled.span`
  font-size: 1em;
  color: aliceblue;
  font-family: ${MINSAPAY_FONT};
  position: absolute;
  bottom: 10px;
  left: 10px;
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
          <ImgDiv>
            <Image src={Logo} onDoubleClick={onLogoImageDoubleClick} />
          </ImgDiv>
          <Title>Login</Title>
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
          {error && <Error>{error}</Error>}
        </LoginBox>
      </Wrapper>
      <PicSource>
        총괄 및 개발 2024 과학기술부 & 사진 제공 TTL & 로고 제공 28기 정윤홍
      </PicSource>
    </OuterWrapper>
  );
}
