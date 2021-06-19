import styled from "@emotion/styled";

const TblRow = styled.div`
  display: flex;
  margin: 5px 10px;
  flex-direction: ${(p) => p.type === "ask" ? "row" : "row-reverse"};
  font-weight: bold;
  margin-bottom: ${(p) => p.header === true ? "16px" : "8px"};
  line-height: 150%;
`;

const TblCell = styled.div`
  color: ${(p) => p.header === true ? "#6d7482" : p.color};
  flex: 1;
  text-align: right;
  line-height: 150%;
  letter-spacing: 1px;
`;

function TableRow({ type, header, value }) {

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <TblRow type={type} header={header}>
      <TblCell
        header={header}
        color="white">
        {numberWithCommas(value.total)}
      </TblCell>
      <TblCell
        header={header}
        color="white">
        {numberWithCommas(value.size)}
      </TblCell>
      <TblCell
        header={header}
        color="#0db57e">
        {numberWithCommas(value.price)}
      </TblCell>
    </TblRow>
  );
}

export default TableRow;
