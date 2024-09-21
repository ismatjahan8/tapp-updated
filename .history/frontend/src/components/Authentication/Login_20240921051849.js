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
        description: "Failed to load chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // Fetch user info from localStorage and set loggedUser when component mounts
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(userInfo); // Set the logged user state
    fetchChats(); // Fetch chats when component loads or when fetchAgain changes
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats && chats.length > 0 ? (
          <Stack overflowY="scroll">
            {chats.map(
              (chat) =>
                chat &&
                chat._id && (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    <Text>
                      {loggedUser && chat.users && !chat.isGroupChat
                        ? getSende(loggedUser, chat.users) // Ensure loggedUser is used here
                        : chat.chatName}
                    </Text>
                  </Box>
                )
            )}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
