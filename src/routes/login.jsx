import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { auth } from "../features/login-feature";
import styled from "styled-components";
import Logo from "../images/TempLogoMinsapay.svg";

const MINSAPAY_BLUE = "#66A3FF";

// figma 제대로 된 치수 필요
const WRAPPER_WIDTH = 360;
const Wrapper = styled.div`
  width: ${WRAPPER_WIDTH}px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
`;
const LoginBox = styled.div`
  height: 600px;
  background-color: white;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const TitleDiv = styled.div`
  margin-top: 70px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
const Title = styled.span`
  font-size: 65px;
`;
const Image = styled.img`
  height: 65px;
`;
const Form = styled.form`
  margin-top: 170px;
  margin-bottom: 10px;
  margin-right: 40px;
  margin-left: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const Input = styled.input`
  padding: 5px 0px;
  border: none;
  width: ${WRAPPER_WIDTH - 60}px;
  font-size: 16px;
  outline: none;
  border-bottom: 3px solid #ccc;
  margin-top: 25px;
  &:focus {
    border-bottom: 3px solid #000;
  }
  &[type="submit"] {
    margin-top: 70px;
    cursor: pointer;
    width: 130px;
    height: 60px;
    border-radius: 50px;
    background-color: ${MINSAPAY_BLUE};
    color: white;
    font-size: 20px;
    font-weight: bold;
    &:hover {
      opacity: 0.8;
    }
  }
`;
const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export default function Login() {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (userID === "" || password === "") return;
    await auth.signIn(userID, password);
    setError(auth.error);
    //navigate("/");
    console.log(auth.currentUser);
  };
  return (
    <Wrapper>
      <LoginBox>
        <TitleDiv>
          <Title>Login </Title>
          <Image src={Logo} />
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
  );
}
