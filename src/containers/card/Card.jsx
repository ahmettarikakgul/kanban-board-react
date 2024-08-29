import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlineClockCircle } from "react-icons/ai";
import Dropdown from "../../components/dropdown/Dropdown";
import cardStyles from "./card.module.css";
import { Link, useLocation } from "react-router-dom";

const Card = ({ card, handleDeleteTask, cardArray, boardId }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location=useLocation()
  function handleClick() {
    setShowDropdown(!showDropdown);
  }
  return (
    <div className={cardStyles.card_main}>
      <div className={cardStyles.card_top}>
        <Link
          style={{ textDecoration: "none" }}
          to= {`/${boardId}/${card.cardID}/${card.cardTitle}`}
          state={{previousLocation: location}}
          // to={{pathname: `/${boardId}/${card.cardID}/${card.cardTitle}`, state:{background:location}}}
        >
          <div className={cardStyles.card_title}>{card?.cardTitle}</div>
        </Link>
        <div className={cardStyles.top_more}>
          <FiMoreHorizontal onClick={handleClick} />
          {showDropdown && (
            <Dropdown>
              <div className={cardStyles.dropdown}>
                <p>
                  <span
                    onClick={() => handleDeleteTask(card.cardID, cardArray)}
                  >
                    Sil
                  </span>
                </p>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
      <div className={cardStyles.card_footer}>
        {card?.createdAt && (
          <p>
            <AiOutlineClockCircle /> {card?.createdAt}
          </p>
        )}
      </div>
    </div>
  );
};

export default Card;
