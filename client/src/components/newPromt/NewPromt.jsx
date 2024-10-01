import { useEffect, useRef, useState } from "react";
import { IKImage } from "imagekitio-react";
import "./newPromt.css";
import Upload from "../upload/Upload";
import model from "../../lib/gemini";
import Markdown from "react-markdown";

const NewPromt = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
  });

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [img, question, answer]);

  const add = async (text) => {
    setQuestion(text);
    const result = await model.generateContent(text);
    setAnswer(result.response.text);
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
      {img.isLoading && <div className="message user">uploading...</div>}
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
