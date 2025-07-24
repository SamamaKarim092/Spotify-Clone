import { Routes, Route } from "react-router-dom";
import  Homepage  from "./pages/home/HomePage";
import  AuthCallbackPage  from "./pages/auth-callback/AuthCallback"; 
import axios from "axios";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

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
        <Route path="/" element={<Homepage />} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signInFallbackRedirectUrl={"/auth-callback"}/>} />
      </Routes>


    </>
  );
}

export default App;
