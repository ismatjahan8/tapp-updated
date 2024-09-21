import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedUser, setLoggedUser] = useState(null); // Define local state for loggedUser
  const toast = useToast();
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post("/api/user/login", { email, password });

      // Store user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Update loggedUser state
      setLoggedUser(data); // Set loggedUser after successful login

      // Redirect or refresh
      history.push("/chats");
      window.location.reload(); // Optional: refresh page
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
