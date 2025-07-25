import { Routes, Route } from "react-router-dom";
import  HomePage  from "./pages/home/HomePage";
import ChatPage from "./pages/chat/ChatPage";
import  AuthCallbackPage  from "./pages/auth-callback/AuthCallback"; 
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";

function App() {
// token =>
// const getSomeData = async () => {
//   const res = await axios.get('/users', {
//     headers: {
//       "Authorization": `Bearer ${('token')}`
//     }
//   });
//   console.log(res);
// }

  return (
    <>
      <Routes>
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signInFallbackRedirectUrl={"/auth-callback"}/>} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
