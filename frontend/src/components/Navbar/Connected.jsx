import React from "react";
import "./Connected.css";

const Connected = (props) => {
  const address = props.address;
  const DOWTokenBalance = props.DOWTokenBalance;
  const networkCoinBalance = props.networkCoinBalance;

  return (
    <ul className="connected">
      <li className="account-balance">
        {parseFloat(DOWTokenBalance).toFixed(2)} DOW
      </li>
      <li className="account-balance">
        {parseFloat(networkCoinBalance).toFixed(2)} MATIC
      </li>
      <li>
        {address.slice(0, 5)}...
        {address.slice(address.length - 4, address.length)}
      </li>
    </ul>
  );
};

export default Connected;
