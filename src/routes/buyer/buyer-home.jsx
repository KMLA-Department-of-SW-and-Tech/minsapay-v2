import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buyerFirebase } from "../../features/buyer-firebase-interaction";
import OrderElementBuyer from "../../components/buyer/order-element-buyer";
import { onSnapshot } from "firebase/firestore";
import CoupleList from "../../components/CPU/couple-list";
import { BuyerHeader } from "../../components/buyer/buyer-header";
import PayIconRef from "../../images/go-to-buyer-payment.svg";
import MenuIconRef from "../../images/LogIcon.svg"; // 메뉴 아이콘 이미지 경로 추가
import Loading from "../../components/loading";
import MenuImageRef from "../../images/MenuImage.png";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PayIconWrapper = styled.div`
  width: 100%;
  height: 9vh;
  display: flex;
  background-color: white;
  justify-content: center; /* 아이콘을 중간으로 배치 */
  align-items: center;
  position: relative; /* 위치 조정을 위한 relative 속성 추가 */
`;

const PayIcon = styled.img`
  height: 7vh;
  margin-bottom: 1vh;
  margin-top: 1vh;
  &:hover {
    cursor: pointer;
  }
`;

const MenuIcon = styled.img`
  height: 5vh; /* 메뉴 아이콘의 크기 설정 */
  position: absolute;
  right: 1rem; /* 오른쪽 끝에 배치 */
  &:hover {
    cursor: pointer;
  }
`;

const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background: url(${MenuImageRef}) center/cover no-repeat;
  display: ${(props) => props.showmenu};
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

const OrderListContainer = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
`;

export default function BuyerHome() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showmenu, setShowmenu] = useState("none"); // 메뉴판 표시 상태 추가

  useEffect(() => {
    let unsubscribe = null;
    const init = async () => {
      // 초기에 잔고, 이미지 로딩
      await buyerFirebase.init();
      setBalance(buyerFirebase.userDocData.balance);
      setOrderList(
        buyerFirebase.orderHistory
          .toReversed()
          .map((val, index) => (
            <OrderElementBuyer
              menuName={val.menu_name}
              teamName={val.team_name}
              price={val.price}
              status={val.current_state}
              refundRequest={val.refund_request}
              id={val.order_id}
              key={index}
            />
          )),
      );
      unsubscribe = onSnapshot(buyerFirebase.userDocRef, (doc) => {
        buyerFirebase.userDoc = doc;
        buyerFirebase.userDocData = doc.data();
        buyerFirebase.orderHistory = JSON.parse(
          buyerFirebase.userDocData.order_history,
        );
        setBalance(buyerFirebase.userDocData.balance);
        setOrderList(
          buyerFirebase.orderHistory
            .toReversed()
            .map((val, index) => (
              <OrderElementBuyer
                menuName={val.menu_name}
                teamName={val.team_name}
                price={val.price}
                status={val.current_state}
                refundRequest={val.refund_request}
                id={val.order_id}
                key={index}
              />
            )),
        );
        setIsLoading(false);
      });
    };
    init();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      <BuyerHeader balance={balance} />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <OrderListContainer>
            <CoupleList dataList={orderList} />
          </OrderListContainer>
          <PayIconWrapper>
            <PayIcon
              onClick={() => navigate("/buyer-home/buyer-payment")}
              src={PayIconRef}
            />
            <MenuIcon
              onClick={() => setShowmenu("block")}
              src={MenuIconRef} // 메뉴 아이콘 이미지 추가
            />
          </PayIconWrapper>
          <MenuContainer showmenu={showmenu}>
            <CloseButton onClick={() => setShowmenu("none")}>X</CloseButton>
          </MenuContainer>
        </>
      )}
    </Wrapper>
  );
}
