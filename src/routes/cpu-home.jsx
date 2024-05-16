import styled from "styled-components";
import { auth } from "../features/login-feature";
import { useState } from "react";
import CoupleList from "../components/couple-list";
import { Header } from "../components/cpu-header";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  BORDER_GRAY,
  BUTTON_SHADOW,
  MINSAPAY_BLUE,
} from "../components/theme-definition";

// border 다 추가하기

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 40px;
`;
const CPUHomeBox = styled.div`
  width: 1355px;
`;

const TopDiv = styled.div`
  margin-top: 21px;
  width: 100%;
  height: 140px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-family: "BMDOHYEON";
  font-size: 36px;
  // font size change needed
`;
const Title = styled.div`
  width: 971px;
  height: 136px;
  flex-direction: row;
  display: flex;
  align-items: center;
  border: 3px solid ${BORDER_GRAY};
  border-radius: 20px;
`;
const TeamName = styled.div`
  // needs font change
  margin-left: 125px;
  text-align: center;
  width: 240px;
`;
const Balance = styled.div`
  // needs font change
  margin-left: 233px;
  text-align: center;
  width: 222px;
`;

const HeaderBtns = styled.div`
  // button 사이 gap 추가
  display: flex;
  flex-direction: column;
  width: 384px;
  height: 100%;
  justify-content: space-around;
  align-items: flex-end;
  gap: 20px;
`;

const Btn = styled.button`
  border-radius: 40px;
  border: 3px solid ${BORDER_GRAY};
  background-color: ${MINSAPAY_BLUE};
  box-shadow: 0px 4px 4px 0px ${BUTTON_SHADOW};
  color: white;
  text-align: center;
  width: 351px;
  height: 60px;
  font-size: 20px;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const BodyDiv = styled.div`
  display: flex;
  margin-top: 39px;
  width: 100%;
  flex-direction: column;
`;

export default function CPUHome() {
  const userDocRef = doc(database, "Teams", auth.currentUser.userID);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const init = async () => {
    const userDoc = await getDoc(userDocRef);
    const userDocData = userDoc.data();
    setBalance(userDocData.balance);
  };
  init();
  const onChangeMenuClick = (e) => {
    e.preventDefault();
    navigate("change-menu");
  };
  const onRefundApprovalClick = (e) => {
    e.preventDefault();
    navigate("refund-approval");
  };
  return (
    <Wrapper>
      <Header />
      <CPUHomeBox>
        <TopDiv>
          <Title>
            <TeamName>{auth.currentUser.username}</TeamName>
            <Balance>{balance}원</Balance>
          </Title>
          <HeaderBtns>
            <Btn onClick={onChangeMenuClick}>메뉴편집</Btn>
            <Btn onClick={onRefundApprovalClick}>환불승인</Btn>
          </HeaderBtns>
        </TopDiv>
        <BodyDiv>
          <CoupleList />
        </BodyDiv>
      </CPUHomeBox>
    </Wrapper>
  );
}

/* using database!!
const doc = await addDoc(collection(db, "tweets"), {
  tweet,
  createdAt: Date.now(),
  username: user.displayName || "Anonymous",
  userId: user.uid,
});
await updateDoc(doc, {
  photo: url,
});
const fetchTweets = async () => {
    const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(tweetsQuery);
    const tweets = snapshot.docs.map((doc) => {
        const {tweet, createdAt, userId, username, photo} = doc.data();
        return {
            tweet, createdAt, userId, username, photo,
            id: doc.id,
        }
    }); */
