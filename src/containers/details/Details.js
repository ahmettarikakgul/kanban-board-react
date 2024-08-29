import React, { useState} from "react";
import style from "./Details.module.css";
import { FaLaptop } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Icons from "../../components/icons/Icons";
import Activity from "../../components/activity/Activity";
import Description from "../../components/description/Description";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState} from "recoil";
import { ListData, dialogBox } from "../../recoil/atom";
import { Dialog, DialogContent, Backdrop, Button } from "@mui/material";


export default function Details() {
  const [isDialog, setIsDialog] = useRecoilState(dialogBox);
  const [newTitle, setNewTitle] = useState("");
  const { boardId, cardId } = useParams();
  const [showTitle, setShowTitle] = useState(true);
  const [globalListData, setGlobalListData] = useRecoilState(ListData);
  const navigate = useNavigate();
    console.log("Component running")

    console.log(globalListData);
    const allLists=JSON.parse(localStorage.getItem("board"))
    const requiredList = allLists.find((item) => item.id === boardId);
    const requiredListName=requiredList?.boardName
    const requiredCard = requiredList?.cards.find((card) => card.cardID === cardId);

    const cardActivityLog = requiredCard?.activityLog || [];
    const initialTitle=requiredCard?.cardTitle || ""
    const cardComments=requiredCard?.comments || []
    const cardDescription=requiredCard?.discription

    function handleTitle() {
      setShowTitle(!showTitle)
      }
    

  function handleClose() {
    setIsDialog(false);
  }

  const handleInput = (event) => {
    console.log(event.target.value)
    setNewTitle(event.target.value);
    
  };


  function updateTitle(){


    const previousData = allLists;
    const updatedData = previousData.map((list) => {
      if (list.id === boardId) {
        const updatedCards = list.cards.map((card) => {
          if (card.cardID === cardId) {
            return { ...card, cardTitle: newTitle };
          }
          return card;
        });
        return { ...list, cards: updatedCards };
      }
      return list;
    });

    setGlobalListData(updatedData);
    localStorage.setItem("board", JSON.stringify(updatedData));
    setShowTitle(!showTitle)
  };

  function updateComments(newComment){
    cardComments.unshift(newComment)

    const updatedData=allLists.map(list=>{if(list.id===cardId){
      return (list.cards.map(card=>{if(card.cardID===cardId){return({...card, comments: cardComments})}
      else return(card)}))}
      else return(list)})
      localStorage.setItem("board", JSON.stringify(updatedData));
      setGlobalListData(updatedData);
    console.log(updatedData);
    // localStorage.setItem("board", JSON.stringify(updatedData));
    }

      

  return (
    <>
      <Backdrop open={isDialog} onClick={handleClose} />
      <Dialog
        open={isDialog}
        PaperProps={{
          sx: {
            maxWidth: "40vw",
            width: 800,
            minHeight: "80vh",
            backgroundColor: "whitesmoke",
          },
        }}
      >
        <DialogContent>
          <div className={style.titleWrapper}>
            <div className={style.laptop}>
              <FaLaptop />
            </div>
            <div className={style.title}>
              {showTitle ? (<>
                <h3>{initialTitle}</h3>
                </>
              ) : (
                <span className={style.textArea}>
                  <input
                    key={requiredCard && requiredCard.cardID}
                    type="text"
                    value={newTitle}
                    onChange={handleInput}
                    style={{ width: "90%", border: "none", height: "30px" }}
                  />
                </span>
              )}
              <span>in List {requiredListName}</span>
              <div>
                 <Button
                   variant="contained"
                   style={{
                     backgroundColor: "#00a82d",
                     color: "white",
                     height: "30px",
                     marginRight: "5px",
                     marginTop: "10px",
                     fontSize: "12px",
                   }}
                   onClick={handleTitle}
                 >
                   {showTitle ? "Update Card Title" : "Cancel"}
                 </Button> 
                { !showTitle && (
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#00a82d",
                      color: "white",
                      height: "30px",
                      marginTop: "10px",
                      fontSize: "12px",
                    }}
                    onClick={updateTitle}
                  >
                    Save
                  </Button>
                )} 
              </div>
            </div>
            <span className={style.cross}>
              <Icons icon={<RxCross2 style={{cursor: "pointer"}} onClick={() => navigate("/")} />} />
            </span>
          </div>
          <div>
            <Description boardId={boardId} cardId={cardId} cardDescription={cardDescription}/>
            <Activity
              cardId={cardId}
              boardId={boardId}
              cardActivityLog={cardActivityLog}
              cardComments={cardComments}
              updateComments={updateComments}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
