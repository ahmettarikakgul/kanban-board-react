import React, { useState } from "react";
import board from "./board.module.css";
import { FiMoreHorizontal } from "react-icons/fi";
import { IconContext } from "react-icons"
import Card from "../card/Card";
import Editable from "../../components/editable/Editable";
import Dropdown from "../../components/dropdown/Dropdown";
import { v4 as uuid } from "uuid";
import { ListData } from "../../recoil/atom";
import { useRecoilState } from "recoil";
import { Draggable, Droppable } from "react-beautiful-dnd";

const Board = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [listTitle, setListTitle] = useState(props.board?.boardName);
  const [globalListData, setGlobalListData] = useRecoilState(ListData);

  function handleEditTitle() {
    setEditMode(true);
  }

  function handleSaveTitle(id) {
    let tempListData = [...globalListData];
    let index = tempListData.findIndex((ele) => ele.id === id);
    let currentBoard = { ...tempListData[index] };
    currentBoard.boardName = listTitle;
    // console.log(currentBoard)
    tempListData[index] = currentBoard;
    setGlobalListData(tempListData);
    localStorage.setItem("board", JSON.stringify(tempListData));
    setEditMode(false);
  }
  function handleChangeTitle(event) {
    setListTitle(event.target.value);
  }

  function handleClick() {
    setShowDropdown(!showDropdown);
  }

  function handleDeleteBoard(id) {
    let tempListData = [...globalListData];
    tempListData = tempListData.filter((ele) => ele.id !== id);
    setGlobalListData(tempListData);
    localStorage.setItem("board", JSON.stringify(tempListData));
    // console.log(globalListData);
  }
  function handleAddTask(inputValue) {

    function convertTo12HourFormat(time) {
      const [hours, minutes] = time.split(":");
      let period = "AM";

      let hours12 = parseInt(hours, 10);
      if (hours12 === 0) {
        hours12 = 12;
      } else if (hours12 === 12) {
        period = "PM";
      } else if (hours12 > 12) {
        hours12 -= 12;
        period = "PM";
      }

      return `${hours12}:${minutes} ${period}`;
    }
    const currentDate = new Date();
    const formatDate = currentDate.getDate();
    const currentTime = convertTo12HourFormat(
      currentDate.getHours() + ":" + currentDate.getMinutes()
    );
    const formatMonth = currentDate.toLocaleString("default", {
      month: "short",
    });
    const newCard = {
      cardID: uuid(),
      discription: "",
      cardTitle: inputValue,
      createdAt: `${formatDate} ${formatMonth}`,
      activityLog: [
        {
          activity: `Team 1 added this card to ${props.board.boardName}`,
          time: ` ${formatDate} ${formatMonth} at ${currentTime} `  ,
        },
      ],
      comments:[]
    };
    let tempListData = [...globalListData];
    let index = tempListData.findIndex((ele) => ele.id === props.board.id);
    let temporaryBoard = {
      id: props.board.id,
      boardName: props.board.boardName,
      cards: [...props.board.cards, newCard],
    };
    tempListData[index] = temporaryBoard;
    setGlobalListData(tempListData);
    localStorage.setItem("board", JSON.stringify(tempListData));
  }

  function handleDeleteTask(cardID, cardArray) {
    const tempListData = [...globalListData];
    const boardIndex = tempListData.findIndex(
      (board) => board.id === props.board.id
    );

    if (boardIndex !== -1) {
      const updatedCards = cardArray.filter((card) => card.cardID !== cardID);

      tempListData[boardIndex] = {
        ...tempListData[boardIndex],
        cards: updatedCards,
      };

      setGlobalListData(tempListData);
      localStorage.setItem("board", JSON.stringify(tempListData));
      console.log(tempListData);
    }
  }
  // console.log(props.board.id);
  return (
    <div className={board.main_board}>
      <div className={board.board_top}>
        {editMode ? (
          <input
            className={board.input}
            autoFocus
            type="text"
            defaultValue={props.board.boardName}
            // value={listTitle}
            onChange={handleChangeTitle}
            onBlur={() => handleSaveTitle(props.board.id)}
          />
        ) : (
          <p className={board.board_top_tittle} onClick={handleEditTitle}>
            {props.board?.boardName}
          </p>
        )}
        <div className={board.top_more}>
        <IconContext.Provider value={{ color: "white" }}>
          <FiMoreHorizontal sx={{}} onClick={handleClick} />
          </IconContext.Provider>
          {showDropdown && (
            <Dropdown>
              <div className={board.dropdown}>
                <p>
                  <span onClick={() => handleDeleteBoard(props.board.id)}>
                    Sil
                  </span>
                </p>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
      <Droppable droppableId={props.board.id} key={props.board.id}>
        {(provided) => {
          return (
            <div
              className={`${board.board_cards}  ${board.custom_scroll}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {props.board?.cards?.map((item, i, arr) => (
                <Draggable
                  draggableId={item.cardID}
                  index={i}
                  key={item.cardID}
                >
                  {(provided) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card
                          cardArray={arr}
                          key={item.cardID}
                          card={item}
                          boardId={props.board.id}
                          handleDeleteTask={handleDeleteTask}
                          
                        />
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              <Editable
                text="kart ekle"
                placeholder="Bu kart için bir başlık girin "
                onSubmit={handleAddTask}
              />
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

export default Board;
