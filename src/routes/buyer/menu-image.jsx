import { useNavigate } from "react-router-dom";
import MenuImageRef from "../../images/MenuImage.png";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100%;
  width: 500px;
  @media only screen and (max-width: 768px) {
    width: 100vw;
  }
`;


const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #272424;
  cursor: pointer;
  font-family: sans-serif;
`;


export default function MenuImage() {
  const navigate = useNavigate();


  const onCloseButtonClick = () => {
    navigate("/buyer-home");
  }

  return (
    <Wrapper style={{backgroundImage: `url(${MenuImageRef})`}}>


      <CloseButton onClick={onCloseButtonClick}>X</CloseButton>
    </Wrapper>
  );
  

}