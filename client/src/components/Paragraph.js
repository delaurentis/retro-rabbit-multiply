import React from "react";
import "./Paragraph.css";

function Paragraph(props) {

  // Render our problem here
  return (
    <p className='Paragraph'>
      {props.children}
    </p>
  );
}

export default Paragraph;
