import styled from "styled-components";
import { MINSAPAY_BLUE } from "../components/theme-definition";
import {
  readXlOfEachSheet /* writeXlFromData */,
  writeXlFromData,
} from "./xlsx-conversion";
import { developerFirebase } from "./developer-firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUtils } from "../features/login-feature";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-top: 40px;
`;

const DatabaseInfoButton = styled.label`
  width: 40%;
  height: 5vh;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${MINSAPAY_BLUE};
  color: white;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
/* const GetDatabaseInfoButton = styled.div`
  width: 40%;
  height: 5vh;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${MINSAPAY_BLUE};
  color: white;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`; */
const SubmitDatabaseInfoButton = styled.div`
  width: 40%;
  height: 5vh;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${MINSAPAY_BLUE};
  color: white;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
const Logout = styled.div`
  width: 40%;
  height: 5vh;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${MINSAPAY_BLUE};
  color: white;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export default function DeveloperHome() {
  const [subData, setSubData] = useState({});
  /* const [remainingTime, setRemainingTime] = useState(0);
  const [clickable, setClickable] = useState(true); */
  const [uploadable, setUploadable] = useState(true);
  const navigate = useNavigate();
  const onXlUpload = async (e) => {
    setUploadable(false);
    const file = e.target.files[0];
    let xldata = await readXlOfEachSheet(file); // needs fix
    setSubData(developerFirebase.standardizeSubData(xldata));
    console.log(developerFirebase.standardizeSubData(xldata));
    e.target.value = ""; // 같은 파일 입력해도 반복 실행 */
    setUploadable(true);
  };
  /* const onGetDataClick = async () => {
    setClickable(false);
    const counterLimit = 5;
    setRemainingTime(counterLimit);
    let rm = counterLimit;
    const intervalId = setInterval(async () => {
      if (rm < 0) {
        setClickable(true);
        clearInterval(intervalId);
      } else if (rm === 0) {
        rm--;
        const date = new Date();
        const fileName = "database_info("
          .concat(date.toUTCString())
          .concat(").xlsx");
        await developerFirebase.init();
        await writeXlFromData(fileName, developerFirebase.userSubData);
      } else {
        rm--;
        setRemainingTime(rm);
      }
    }, 1000);
  }; */
  /*   const onSubmitDataClick = async () => {
    if (!confirm("firebase에 변경사항을 저장하시겠습니까?")) return;
    if (Object.keys(subData).length === 0) {
      alert("업로드된 데이터가 없습니다");
      return;
    }
    await developerFirebase.init();
    await developerFirebase.writeDataToFirebase(subData);
  }; */
  const onSubmitDataClick = async () => {
    if (!confirm("firebase에 변경사항을 저장하시겠습니까?")) return;
    if (Object.keys(subData).length === 0) {
      alert("업로드된 데이터가 없습니다");
      return;
    }
    const loginData = await developerFirebase.submitData(subData);
    await writeXlFromData("login_info.xlsx", loginData);
  };
  const onLogoutClick = async () => {
    if (!confirm("로그아웃 하시겠습니까?")) return;
    await loginUtils.signOut();
    navigate("/");
  };
  const onGetTransactionInfoClick = async () => {
    const transactionData = await developerFirebase.getTransactionData();
    console.log(transactionData);
  }
  return (
    <Wrapper>
      <p>Developer Home</p>
      <DatabaseInfoButton onClick={onGetTransactionInfoClick}>
        Get Transaction Info
      </DatabaseInfoButton>
      <DatabaseInfoButton htmlFor="xl-submit">
        {uploadable ? "Upload Database Info" : "Uploading"}
      </DatabaseInfoButton>
      <input
        onChange={uploadable ? onXlUpload : null}
        type="file"
        accept=".xls, .xlsx"
        required
        id="xl-submit"
        style={{ display: "none" }}
      />
      <SubmitDatabaseInfoButton onClick={uploadable ? onSubmitDataClick : null}>
        {uploadable ? "Submit Database Info" : "Uploading"}
      </SubmitDatabaseInfoButton>
      <Logout onClick={onLogoutClick}>Log Out</Logout>
    </Wrapper>
  );
}
