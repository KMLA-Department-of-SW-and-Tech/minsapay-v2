import styled from "styled-components";
import { logFirebase } from "../../features/log-firebase-interaction";
import { onSnapshot, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import Loading from "../../components/loading";
import {
  MINSAPAY_TITLE,
  BACKGROUND_GRAY,
} from "../../components/theme-definition";
import { ModeratorHeader } from "../../components/moderator/moderator-header";
import { developerFirebase } from "../../developer/developer-firebase";


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
      <ModeratorHeader logButtonEnable={false}/>
      <TitleEl>Log</TitleEl>
      <button onClick={async () => {developerFirebase.readLog()}}/>
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
