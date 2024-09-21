import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const Login = ({ setLoggedUser, setChats }) => {
  // Accepting props
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const submitHandler = async () => {
  setLoading(true);
  if (!email || !password) {
    toast({
      title: "Please fill all the fields",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
    return;
  }

  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    // Make the API call to login
    const response = await axios.post("/api/user/login", { email, password }, config);

    // Check if response and data exist
    if (response && response.data) {
      const { data } = response;

      // Handle successful login
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Save user data to localStorage and update state
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoggedUser(data);  // Set the logged-in user
      setLoading(false);
      history.push("/chats");  // Navigate to the chats page
    } else {
      throw new Error("Invalid response from server.");
    }
  } catch (error) {
    // Handle error cases
    let errorMessage = error.response?.data?.message || error.message || "An error occurred!";
    
    // Display error message in a toast notification
    toast({
      title: "Error occurred!",
      description: errorMessage,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    console.error("Login Error: ", error);  // Log the error to the console for debugging
    setLoading(false);
  }
};


  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setLoggedUser(null); // Clear logged user state
    setChats([]); // Clear chat state
  };

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter your email address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
