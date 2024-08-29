import React, { useState } from "react";
import style from "./Activity.module.css";
import Icons from "../icons/Icons";
import { RxActivityLog } from "react-icons/rx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { v4 as uuid } from "uuid";

function Activity({ cardActivityLog, updateComments, cardComments }) {
  console.log("Activity running");
  const [details, setShowDetails] = useState(false);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  // console.log(input);

  function handleShowDetails() {
    setShowDetails(!details);
  }

  function handleSave() {
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

    // const currentDate=new Date()
    var span = document.createElement("span");
    span.innerHTML = input;
    const content = span.textContent || span.innerText;
    // console.log(content)
    updateComments({
      comment: content,
      time: ` ${formatDate} ${formatMonth} at ${currentTime} `,
      commentId: uuid(),
    });
    // setSavedInput(input);
    setEditing(false);
    setInput("");
  }

  function handleCancel() {
    // setInput(savedInput);
    setEditing(false);
  }

  return (
    <>
      <div className={style.main}>
        <span className={style.justifyIcon}>
          <Icons icon={<RxActivityLog />} />
        </span>
        <span className={style.disc}>
          <p>Activity</p>
          <button className={style.button} onClick={handleShowDetails}>
            {details ? "Hide Details" : "Show Details"}
          </button>
        </span>
      </div>

      <div className={style.comment}>
        <div style={{ display: "flex", padding: "10px" }}>
          <img
            className={style.userImage}
            src=" https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
            alt="user"
            width="35px"
            height="35px"
          />
          <span className={style.commentBtn}>
            {editing ? (
              <span className={style.textEditor}>
                <ReactQuill
                  style={{ backgroundColor: "white" }}
                  onChange={setInput}
                />
                <div className={style.btns}>
                  <button onClick={handleSave} className={style.save}>
                    Save
                  </button>
                  <button onClick={handleCancel} className={style.cancel}>
                    Cancel
                  </button>
                </div>
              </span>
            ) : (
              <span>
                <button
                  className={style.addComment}
                  onClick={() => setEditing(true)}
                >
                  Write a comment....
                </button>
              </span>
            )}
          </span>
        </div>
        {cardComments.map((item) => (
          <div key={item.commentId} className={style.commentBox}>
            <img
              className={style.userImage}
              src=" https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
              alt="user"
              width="35px"
              height="35px"
            />
            <span style={{ marginLeft: "10px" }}>
              <span style={{ fontWeight: "bold" }}>Team 1 </span>
              <span className={style.time}>{item.time} </span>
              <p style={{ marginTop: "6px" }}>{item.comment}</p>
            </span>
          </div>
        ))}
      </div>

      <div className={style.detailsDiv}>
        {details ? (
          <>
            <div className={style.mainActivityBox}>
              {cardActivityLog.map((item, index) => (
                <span key={index} className={style.activityImage}>
                  <img
                    className={style.userImages}
                    alt="user"
                    src=" https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
                    width="35px"
                    height="35px"
                  />
                  <span className={style.activityText}>
                    <p>{item.activity}</p>
                    <p style={{ marginTop: "6px" }} className={style.time}>
                      {item.time}
                    </p>
                  </span>
                </span>
              ))}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Activity;
