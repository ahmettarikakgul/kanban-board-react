import React from "react";
import style from "./BoardBar.module.css";
import { AiOutlineStar } from "react-icons/ai";

function BoardBar(props) {
  function handleClear() {
    localStorage.clear();
    window.location.reload();
  }

  const handleIconClick = () => {
    window.location.href = "https://konsepttema.com";
  };

  return (
    <div className={style.navbar}>
      <div className={style.name}>
        Kanban Panosu
        <span className={style.icon} onClick={handleIconClick}>
          <AiOutlineStar />
        </span>
        <span>
          <button className={style.backGbtn} onClick={props.changeImg}>
            Arka Planı Değiştir !
          </button>
        </span>
      </div>
      <div className={style.button}>
        <img
          className={style.userImage}
          src="https://www.ecommercefundamentals.com.tr/wp-content/uploads/2024/08/WhatsApp-Image-2024-06-05-at-10.50.41-1-1.jpeg"
          alt="user"
          width="50px"
          height="50px"
        />
        <button onClick={handleClear} className={style.share}>
          Tahtayı Temizle
        </button>
      </div>
    </div>
  );
}

export default BoardBar;
