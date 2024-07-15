import { useNavigate } from "react-router-dom";
import MenuImageRef from "../../images/MenuImage.png";
import styled from "styled-components";

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
    <>


      <CloseButton onClick={onCloseButtonClick}>X</CloseButton>
    </>
  );
  

}