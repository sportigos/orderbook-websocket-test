import React, { useEffect, useState, useRef } from 'react';
import styled from "@emotion/styled";

const TblRow = styled.div`
  display: flex;
  margin: 5px 10px;
  flex-direction: row;
  font-weight: bold;
  margin-bottom: ${(p) => p.type === "header" ? "16px" : "8px"};
  line-height: 150%;
`;

const TblCell = styled.div`
  color: ${(p) => p.type === "header" ? "#6d7482" : p.color};
  flex: 1;
  text-align: right;
  line-height: 150%;
  letter-spacing: 1px;
`;

function TableRow({ type, value }) {

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <TblRow type={type}>
      <TblCell
        type={type}
        color="white">
        {numberWithCommas(value.total)}
      </TblCell>
      <TblCell
        type={type}
        color="white">
        {numberWithCommas(value.size)}
      </TblCell>
      <TblCell
        type={type}
        color="#0db57e">
        {isNaN(parseFloat(value.price)) ? value.price : numberWithCommas(parseFloat(value.price).toFixed(2))}
      </TblCell>
    </TblRow>
  );
}

export default TableRow;
