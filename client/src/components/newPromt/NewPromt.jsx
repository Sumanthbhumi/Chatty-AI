import { useEffect, useRef, useState } from "react";
import { IKImage } from "imagekitio-react";
import "./newPromt.css";
import Upload from "../upload/Upload";
import model from "../../lib/gemini";
import Markdown from "react-markdown";

const NewPromt = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Hello, how can I help you today?" }],
      },
    ],
    generateConfig: {
      // maxOutputTokens: 100,
    },
  });

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [img, question, answer]);

  const add = async (text) => {
    setQuestion(text);

    const result = await chat.sendMessageStream(
      Object.entries(img.aiData).length ? [img.aiData, text] : [text],
    );

    let accumulatedText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      accumulatedText += chunkText;
      setAnswer(accumulatedText);
    }

    setImg({
      isLoading: false,
      error: "",
      dbData: {},
      aiData: {},
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text);
    e.target.text.value = "";
  };

  return (
    <>
      {img.isLoading && <div className="uploading message "></div>}
      {img.dbData?.filePath && (
        <div className="message user">
          <IKImage
            urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
            path={img.dbData.filePath}
            width="300"
            height="200"
            transformation={[{ width: 380 }]}
          />
        </div>
      )}

      {question && (
        <div className="message user">
          <Markdown>{question}</Markdown>
        </div>
      )}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit}>
        <Upload setImg={setImg} />
        <input type="file" multiple={false} hidden id="file" />
        <input placeholder="Write a new promt..." name="text" />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPromt;
