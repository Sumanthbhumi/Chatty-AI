import "./chatPage.css";
import NewPromt from "../../components/newPromt/NewPromt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isLoading, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="chatpage">
      <div className="wrapper">
        <div className="chat">
          {isLoading
            ? "Loading..."
            : error
              ? "Something went wrong"
              : data?.history?.map((message, i) => (
                <>
                  {message.parts[0].img && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={message.parts[0].img}
                      width="300"
                      height="200"
                      transformation={[{ width: 380 }]}
                      className="image user"
                    />
                  )}
                  <div
                    className={
                      message.role === "user" ? "message user" : "message"
                    }
                    key={i}
                  >
                    <Markdown>{message.parts[0].text}</Markdown>
                  </div>
                </>
              ))}
          <NewPromt data={data} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
