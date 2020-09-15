import React from "react";
import PropTypes from "prop-types";

// TODO specifiying button width does not have any effect right now
function Button({
  buttonText,
  bgColor = "bg-xmrorange",
  buttonWidth = "w-40",
  textSize = "text-xl",
}) {
  const styles =
    bgColor +
    " " +
    buttonWidth +
    " " +
    textSize +
    " mx-auto flex justify-center mt-4 py-2 px-8 h-auto rounded text-white border-xmrgray border-2 hover:bg-xmrorange-darker hover:border-white";
  return <button className={styles}>{buttonText}</button>;
}

// Button.propTypes =
export default Button;
