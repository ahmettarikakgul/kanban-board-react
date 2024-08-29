import React from "react";

const Dropdown = (props) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        right: "0",
      }}
    >
      {props.children}
    </div>
  );
};

export default Dropdown;
