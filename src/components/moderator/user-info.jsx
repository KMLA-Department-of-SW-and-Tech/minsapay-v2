import styled from "styled-components";
import { useState, useEffect } from "react";
import { BORDER_GRAY, MINSAPAY_BLUE } from "../../components/theme-definition";
import { moderatorFirebase } from "../../features/moderator-firebase-interaction";
import { onSnapshot } from "firebase/firestore";
import { MINSAPAY_FONT } from "../../components/theme-definition";

const Wrapper = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 20px; /* 마진 추가 */
  position: fixed;
  top: 25vh;
  left: 46vw;
  z-index: 1000; /* 다른 요소 위에 표시되도록 z-index 설정 */
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 3px solid ${BORDER_GRAY};
  border-radius: 10px;
  margin-bottom: 20px; /* 텍스트 칸 간격 추가 */
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Cell = styled.div`
  flex: 1;
  padding: 10px;
  border-bottom: 1px solid ${BORDER_GRAY};
  border-radius: 7px;
  &:last-child {
    border-bottom: none;
  }
  &:nth-child(odd) {
    background-color: #e9e9e9;
  }
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const Text = styled.span`
  font-family: "TheJamsil";
  font-size: 1.5em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start; /* 왼쪽 정렬 */
  text-align: left; /* 왼쪽 정렬 */
`;

const Btn = styled.button`
  border-radius: 20px; /* 버튼 크기 조정 */
  border: 2px solid ${BORDER_GRAY}; /* 테두리 두께 조정 */
  background-color: ${MINSAPAY_BLUE};
  color: white;
  text-align: center;
  font-size: 1em; /* 폰트 크기 조정 */
  padding: 10px; /* 패딩 추가 */
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column; /* 세로로 배열 */
  align-items: center;
  gap: 10px; /* 버튼 간격 추가 */
  margin-bottom: 20px; /* 하단 마진 추가 */

  & > div {
    display: flex;
    gap: 20px; /* 가로 간격 추가 */
  }
`;

const Input = styled.input.attrs({
  type: "number",
})`
  padding: 10px;
  border: none;
  width: 100%;
  font-size: 3vh;
  @media only screen and (max-width: 700px) {
    font-size: 2vh;
  }
  outline: none;
  border-bottom: 3px solid ${BORDER_GRAY};
  margin-top: 20px;
  font-family: ${MINSAPAY_FONT};

  &:focus {
    border-bottom: 3px solid #444;
  }
`;

const FormWrapper = styled.form`
  margin-bottom: 20px;
  width: 47vw;
`;

export function UserInfo({ userId, hideInfoPanel }) {
  const [balanceChangeVal, setBalanceChangeVal] = useState(0);
  const [selectedUser, setSelectedUser] = useState(
    moderatorFirebase.usersList[moderatorFirebase.usersIndex[userId]],
  );

  useEffect(() => {
    setSelectedUser(
      moderatorFirebase.usersList[moderatorFirebase.usersIndex[userId]],
    );
  }, [userId]);

  onSnapshot(moderatorFirebase.usersRef[userId], () => {
    setSelectedUser(
      moderatorFirebase.usersList[moderatorFirebase.usersIndex[userId]],
    );
  });

  const onChange = (e) => {
    if (e.target.value === "") {
      setBalanceChangeVal(0);
      return;
    }

    const isDigit = (char) => {
      return /\d/.test(char);
    };

    let isNumber = true;
    for (let i = 0; i < e.target.value.length; i++) {
      isNumber = isNumber && isDigit(e.target.value[i]);
    }
    if (!isNumber) return;
    const val = parseInt(e.target.value);
    if (val < 0 || val > 100000) return;
    setBalanceChangeVal(val);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    moderatorFirebase.changeBalance(userId, balanceChangeVal);
    setBalanceChangeVal(0);
    hideInfoPanel();
  };

  const onClick = () => {
    if (balanceChangeVal === 0) return;
    moderatorFirebase.changeBalance(userId, balanceChangeVal);
    setBalanceChangeVal(0);
    hideInfoPanel();
  };

  const buttonValues = [10000, 5000, 1000, 500];
  return (
    <Wrapper>
      <TextWrapper>
        <Row>
          <Cell>
            <Text>사용자</Text>
          </Cell>
          <Cell>
            <Text>{selectedUser.data().username}</Text>
          </Cell>
        </Row>
        <Row>
          <Cell>
            <Text>보유 금액</Text>
          </Cell>
          <Cell>
            <Text>{selectedUser.data().balance}</Text>
          </Cell>
        </Row>
      </TextWrapper>
      <FormWrapper onSubmit={onSubmit}>
        <Input
          type="number"
          onChange={onChange}
          value={balanceChangeVal}
          placeholder="변경할 금액 입력"
        ></Input>
      </FormWrapper>
      <ButtonWrapper>
        <div>
          {buttonValues.map((value) => {
            return (
              <Btn
                key={"+" + value}
                onClick={() => {
                  setBalanceChangeVal((balance) => parseInt(balance) + value);
                }}
              >
                +{value}
              </Btn>
            );
          })}
        </div>
        <div>
          {buttonValues.map((value) => {
            return (
              <Btn
                key={"-" + value}
                onClick={() => {
                  setBalanceChangeVal((balance) => parseInt(balance) - value);
                }}
              >
                -{value}
              </Btn>
            );
          })}
        </div>
      </ButtonWrapper>
      <ButtonWrapper>
        <div>
          <Btn onClick={() => setBalanceChangeVal(0)}>Clear</Btn>
          <Btn onClick={onClick}>반영하기</Btn>
        </div>
      </ButtonWrapper>
    </Wrapper>
  );
}
