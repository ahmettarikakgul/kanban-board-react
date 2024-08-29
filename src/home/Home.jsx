import React, { useEffect, useState } from "react";
import style from "./Home.module.css";
import BoardBar from "../containers/navbars/BoardBar";
import Board from "../containers/board/Board";
import Editable from "../components/editable/Editable";
// import { Outlet } from "react-router-dom";
import { ListData } from "../recoil/atom";
import { useRecoilState } from "recoil";
import { v4 as uuid } from "uuid";
import { DragDropContext } from "react-beautiful-dnd";

const data = [
  {
    image:
      "https://images.unsplash.com/photo-1556379092-dca659792591?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
 

  {
    image:
      "https://c4.wallpaperflare.com/wallpaper/952/536/1006/winter-4k-pc-desktop-wallpaper-thumb.jpg",
  },
  {
    image:
      "https://r4.wallpaperflare.com/wallpaper/444/19/627/sunrise-annapurna-massif-himalayas-minimal-wallpaper-28d62d6860d03c28a04c618e3892b4ba.jpg",
  },
  {
    image:
      "https://images.unsplash.com/photo-1556827739-8cdac8bc6855?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    image:
      "https://images.unsplash.com/photo-1557444589-fc3df1ff17a8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    image:
      "https://wallpapercave.com/wp/wp2375495.jpg",
  },
  {
    image:
      "https://i.pinimg.com/474x/7f/fe/dd/7ffeddc67d1fa80080c0a1377faa9690.jpg",
  },
 
];

function Home() {
  const [globalListData, setGlobalListData] = useRecoilState(ListData);
  const [img, setImg] = useState(0);
  useEffect(() => {
    const storedData = localStorage.getItem("board");
    if (storedData) {
      setGlobalListData(JSON.parse(storedData));
    }
  }, [setGlobalListData]);

  function handleAddList(inputValue) {
    let Id = uuid();

    const board = {
      id: Id,
      boardName: inputValue,
      cards: [],
    };

    setGlobalListData([...globalListData, board]);
    localStorage.setItem("board", JSON.stringify([...globalListData, board]));
    
  }
  function onDragEnd(result) {
    
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId !== destination.droppableId) {
      const [sourceBoard] = globalListData.filter(
        (elem) => elem.id === source.droppableId
      );
      const [destinationBoard] = globalListData.filter(
        (elem) => elem.id === destination.droppableId
      );

      const sourceCard = [...sourceBoard.cards];
      const destinationCard = [...destinationBoard.cards];

      const [removedCard] = sourceCard.splice(source.index, 1);

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
      const newActivity = {
        activity: `Team 1 moved this card from ${sourceBoard.boardName} to ${destinationBoard.boardName}`,
        time: `${formatMonth} ${formatDate} at ${currentTime} `,
      };
      const oldActivityLog = removedCard.activityLog;
      const newActivityLog = [newActivity, ...oldActivityLog];
      const updatedRemovedCard = {
        ...removedCard,
        activityLog: newActivityLog,
      };
      console.log(updatedRemovedCard)

      destinationCard.splice(destination.index, 0, updatedRemovedCard);

      const updatedCards = globalListData.map((elem) => {
        if (elem.id === source.droppableId) {
          return { ...elem, cards: sourceCard };
        } else if (elem.id === destination.droppableId) {
          return { ...elem, cards: destinationCard };
        }
        return elem;
      });

      setGlobalListData(updatedCards);
      localStorage.setItem("board", JSON.stringify(updatedCards));
    } 
    else {
      const [sourceBoard] = globalListData.filter(
        (elem) => elem.id === source.droppableId
      );
      const sourceCard = [...sourceBoard.cards];

      const [removedCard] = sourceCard.splice(source.index, 1);
      sourceCard.splice(destination.index, 0, removedCard);

      const updatedCards = globalListData.map((elem) => {
        if (elem.id === source.droppableId) {
          return { ...elem, cards: sourceCard };
        }
        return elem;
      });
      setGlobalListData(updatedCards);
      localStorage.setItem("board", JSON.stringify(updatedCards));
    }
  }

  function changeImg() {
    setImg(img + 1);
    if (img === data.length - 1) {
      setImg(0);
    }
  }

  return (
    <>
      <div className={style.mainLayout}>
        <div
          className={style.image}
          style={{
            backgroundImage: `url(${data[img].image})`,
            height: "100vh",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "3s",
          }}
        >
          <BoardBar changeImg={changeImg} />
          <div className={style.outer_board}>
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
              <div className={style.inner_board}>
                {globalListData?.map((item, index) => (
                  <Board index={index} key={item.id} board={item} />
                ))}
                <Editable
                  text="Liste Ekleyin"
                  placeholder="Liste başlığını girin"
                  onSubmit={handleAddList}
                />
              </div>
            </DragDropContext>
          </div>
        </div>
        
      </div>
    </>
  );
}

export default Home;
