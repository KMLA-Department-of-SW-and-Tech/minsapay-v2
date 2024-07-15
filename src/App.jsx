import { createBrowserRouter, RouterProvider } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import Login from "./routes/login.jsx";
import {
  ProtectedBuyer,
  ProtectedCPU,
  ProtectedDeveloper,
  ProtectedKiosk,
  ProtectedModerator,
  ProtectedRoute,
  ProtectedSeller,
  ProtectedLog,
  ProtectedLoginSetting,
} from "./components/protected-routes.jsx";
import { BACKGROUND_GRAY } from "./components/theme-definition.js";
import BuyerHome from "./routes/buyer/buyer-home.jsx";
import BuyerPayment from "./routes/buyer/buyer-payment.jsx";
import CPUHome from "./routes/CPU/cpu-home.jsx";
import ChangeMenu from "./routes/CPU/change-menu.jsx";
import KioskHome from "./routes/kiosk/kiosk-home.jsx";
import KioskCover from "./routes/kiosk/kiosk-cover.jsx";
import KioskAuthentiaction from "./routes/kiosk/kiosk-authentication.jsx";
import KioskThankYou from "./routes/kiosk/kiosk-thankyou.jsx";
import DeveloperHome from "./developer/developer-home.jsx";
import SellerSelect from "./routes/seller/seller-select.jsx";
import SellerHome from "./routes/seller/seller-home.jsx";
import ModeratorHome from "./routes/moderator/moderator-home.jsx";
import LogHome from "./routes/log/log-home.jsx";
import AddSeller from "./routes/CPU/add-seller.jsx";

import ChangePassword from "./routes/login-setting.jsx";
import MenuImage from "./routes/buyer/menu-image.jsx";

const router = createBrowserRouter([
  // 루팅
  {
    path: "/",
    element: <ProtectedRoute />, // 기본 화면으로 실제로는 절대로 display 되지는 않고 사용자를 다른 페이지로 보내는데 사용됨
  },
  {
    path: "/developer-home",
    element: (
      <ProtectedDeveloper>
        <DeveloperHome />
      </ProtectedDeveloper>
    ), // 보안 추가해야 함
  },
  {
    path: "/login-setting", // 개발자용
    element: (
      <ProtectedLoginSetting>
        <ChangePassword />
      </ProtectedLoginSetting>
    ),
  },
  {
    path: "/buyer-home", // 개발자용
    element: (
      <ProtectedBuyer>
        <BuyerHome />
      </ProtectedBuyer>
    ),
  },
  {
    path: "/buyer-home/menu-image", // 개발자용
    element: (
      <ProtectedBuyer>
        <MenuImage />
      </ProtectedBuyer>
    ),
  },
  {
    path: "/buyer-home/buyer-payment", // 개발자용
    element: (
      <ProtectedBuyer>
        <BuyerPayment />
      </ProtectedBuyer>
    ),
  },
  {
    path: "/cpu-home", // CPU 홈화면이다.
    element: (
      <ProtectedCPU>
        <CPUHome />
      </ProtectedCPU>
    ),
  },
  {
    path: "/cpu-home/change-menu", // 메뉴 변경 화면
    element: (
      <ProtectedCPU>
        <ChangeMenu />
      </ProtectedCPU>
    ),
  },
  {
    path: "/cpu-home/add-seller", // 환불 승인 화면
    element: (
      <ProtectedCPU>
        <AddSeller />
      </ProtectedCPU>
    ),
  },

  {
    path: "/kiosk-home", // kiosk 홈화면
    element: (
      <ProtectedKiosk>
        <KioskHome />
      </ProtectedKiosk>
    ),
  },
  {
    path: "/kiosk-home/kiosk-cover", // kiosk에서 어서오십시오? 이런 화면
    element: (
      <ProtectedKiosk>
        <KioskCover />
      </ProtectedKiosk>
    ),
  },
  {
    path: "/kiosk-home/kiosk-authentication", // 인증 번호 띄우는 화면
    element: (
      <ProtectedKiosk>
        <KioskAuthentiaction />
      </ProtectedKiosk>
    ),
  },
  {
    path: "/kiosk-home/kiosk-thankyou", // 감사합니다!!
    element: (
      <ProtectedKiosk>
        <KioskThankYou />
      </ProtectedKiosk>
    ),
  },
  {
    path: "/seller-home/seller-select",
    element: (
      <ProtectedSeller>
        <SellerSelect />
      </ProtectedSeller>
    ),
  },
  {
    path: "/seller-home/seller-team/:id",
    element: (
      <ProtectedSeller>
        <SellerHome />
      </ProtectedSeller>
    ),
  },
  {
    path: "/moderator/home", //금정부 관리 페이지
    element: (
      <ProtectedModerator>
        <ModeratorHome />
      </ProtectedModerator>
    ),
  },
  {
    path: "/log",
    element: (
      <ProtectedLog>
        <LogHome />,
      </ProtectedLog>
    ),
  },
  {
    path: "/login", // 로그인 화면으로 아무런 보호 조치가 없다.
    element: <Login />,
  },
]);
const GlobalStyles = createGlobalStyle`
  ${reset};
  * { 
  @font-face {
    font-family: 'MaruBuriSemiBold';
    src: url(https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-SemiBold.eot);
    src: url(https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-SemiBold.eot?#iefix) format("embedded-opentype"), url(https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-SemiBold.woff2) format("woff2"), url(https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-SemiBold.woff) format("woff"), url(https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-SemiBold.ttf) format("truetype");
  }
		font-family: "MaruBuriSemiBold"; // 폰트 정의

  
    @font-face {
    font-family: 'TheJamsil';
    font-weight: 300;
    font-style: normal;
    src: url('https://cdn.jsdelivr.net/gh/webfontworld/TheJamsil/TheJamsil-Light.eot');
    src: url('https://cdn.jsdelivr.net/gh/webfontworld/TheJamsil/TheJamsil-Light.eot?#iefix') format('embedded-opentype'),
        url('https://cdn.jsdelivr.net/gh/webfontworld/TheJamsil/TheJamsil-Light.woff2') format('woff2'),
        url('https://cdn.jsdelivr.net/gh/webfontworld/TheJamsil/TheJamsil-Light.woff') format('woff'),
        url('https://cdn.jsdelivr.net/gh/webfontworld/TheJamsil/TheJamsil-Light.ttf') format("truetype");
    font-display: swap;
}
  font-family: "TheJamsil";

  }
`;

const Wrapper = styled.div`
  background-color: ${BACKGROUND_GRAY};
  min-height: 100vh;
  display: flex;
  justify-content: center;
  font-size: calc(0.6vw + 0.6em); // 자세한 수치 조절
  //font-size: 2vw;
`; // 정중앙에 세로로 div를 하나 세워준다,

function App() {
  return (
    <Wrapper>
      <GlobalStyles />
      <RouterProvider router={router} />
    </Wrapper>
  );
}

export default App;
