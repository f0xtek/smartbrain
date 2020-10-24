import React from "react";

const capitalizeString = s => s.charAt(0).toUpperCase() + s.slice(1);

const CapitalizedText = ({text}) => {
  return (
    capitalizeString(text)
  );
};

export default CapitalizedText;