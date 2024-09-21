import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { getSender } from "../config/ChatLogic";
import { useToast } from "@chakra-ui/react";

const MyChats = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const { user } = ChatState();
  const toast = useToast();

  // Fetch chats from the API
  const fetchChats = async () => {
    if (!user) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      p={3}
      bg="white"
      w="100%"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Text fontSize="2xl" mb={3}>
        My Chats
      </Text>
      {chats.map(
        (chat) =>
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
                {!chat.isGroupChat
                  ? getSender(user, chat.users)
                  : chat.chatName}
              </Text>
            </Box>
          )
      )}
    </Box>
  );
};

export default MyChats;
