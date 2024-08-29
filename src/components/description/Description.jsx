import React, { useEffect, useRef, useState } from "react";
import style from "./Description.module.css";
import Icons from "../../components/icons/Icons";
import { BsJustifyLeft } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRecoilState } from "recoil";
import { ListData } from "../../recoil/atom";

function Description({ boardId, cardId, cardDescription }) {
  const [globalListData, setGlobalListData] = useRecoilState(ListData);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  const [savedInput, setSavedInput] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    // Handle click outside to stop editing
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setEditing(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Load saved input from localStorage
    const savedInput = localStorage.getItem("input");
    if (savedInput) {
      setInput(savedInput);
      setSavedInput(savedInput);
    }
  }, []);

  function handleEdit() {
    setEditing(true);
    setInput(savedInput); // Populate input with saved input
  }

  function handleSave() {
    const unformattedText = input.replace(/(<([^>]+)>)/gi, "");

    let previous = [...globalListData];
    let updatedBoard = previous.map((list) => {
      if (list.id === boardId) {
        const updatedCards = list.cards.map((card) => {
          if (card.cardID === cardId) {
            return { ...card, description: unformattedText }; // Corrected property name
          }
          return card;
        });
        return { ...list, cards: updatedCards };
      }
      return list;
    });

    setGlobalListData(updatedBoard);
    localStorage.setItem("board", JSON.stringify(updatedBoard));
    localStorage.setItem("input", unformattedText);
    setSavedInput(unformattedText);
    setEditing(false);
  }

  function handleCancel() {
    setInput(savedInput); // Reset input with saved input
    setEditing(false);
  }

  return (
    <div className={style.main}>
      <span className={style.justifyIcon}>
        <Icons icon={<BsJustifyLeft />} />
      </span>
      <div className={style.disc}>
        <div className={style.descriptionHeader}>
          <p>
            Description <AiOutlineInfoCircle className={style.infoIcon} />
          </p>
        </div>
        {editing ? (
          <div className={style.inputs} ref={inputRef}>
            <ReactQuill
              style={{ width: "26rem", marginTop: "1rem", backgroundColor: "white" }}
              value={input} // Bind value to input
              onChange={setInput}
            />
            <div className={style.buttonsSave}>
              <button onClick={handleSave} className={style.save}>
                Kaydet
              </button>
              <button onClick={handleCancel} className={style.cancel}>
                İptal
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div
              onClick={handleEdit}
              className={style.savedInput}
              dangerouslySetInnerHTML={{ __html: cardDescription }}
            />
            {!cardDescription && (
              <button onClick={() => setEditing(true)} className={style.button}>
                Daha ayrıntılı bir açıklama ekleyin...
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Description;
