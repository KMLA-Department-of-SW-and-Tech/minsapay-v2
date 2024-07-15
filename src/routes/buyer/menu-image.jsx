import { useNavigate } from "react-router-dom";
import MenuImageRef from "../../images/MenuImage.png";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh;
  width: 500px;
  @media only screen and (max-width: 768px) {
    width: 100vw;
  }
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
const ImageWrapper = styled.img`
  width: 100%;
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
    <Wrapper>
      <ImageWrapper src={MenuImageRef}/>
      <CloseButton onClick={onCloseButtonClick}>X</CloseButton>
    </Wrapper>
  );
  

}