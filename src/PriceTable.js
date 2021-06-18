import React, { useEffect, useState, useRef } from 'react';
import styled from "@emotion/styled";
import TableRow from './TableRow';

const TablePage = styled.div`
  flex: 1;
  padding: 8px 40px;
`;

function PriceTable({ data }) {

  return (
    <TablePage>
      <TableRow type="header" value={{price: "PRICE", size: "SIZE", total: "TOTAL"}}></TableRow>
      {data && data.map(item => (
        <div>
          <TableRow value={item}></TableRow>
        </div>
      ))}
    </TablePage>
  );
}

export default PriceTable;
