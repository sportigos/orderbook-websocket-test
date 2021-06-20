import styled from "@emotion/styled";

const TblRowWrapper = styled.div`
  font-weight: bold;
  line-height: 150%;
  position: relative;
`;

const Visualizer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  :after {
    content: '';
    position: absolute;
    background: ${(p) => p.header === true ? "#00000000" : p.type === "bid" ? "#3e212c" : "#103839"};
    top: 0;
    bottom: 0;
    right: ${(p) => p.type === "bid" ? "0" : "auto"};
    left: ${(p) => p.type === "bid" ? "auto" : "0"};
    width: ${(p) => `${p.percent}%`};
  }
`;

const TblRow = styled.div`
  display: flex;
  flex-direction: ${(p) => p.type === "bid" ? "row" : "row-reverse"};
  padding: ${(p) => p.header === true ? "12px 60px" : "8px 60px"}; 
`;

const TblCell = styled.div`
  color: ${(p) => p.header === true ? "#6d7482" : p.color};
  flex: 1;
  z-index: 10;
  text-align: right;
  line-height: 150%;
  letter-spacing: 1px;
`;

function TableRow({ type, header, value }) {

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <TblRowWrapper type={type} header={header}>
      <Visualizer type={type} header={header} percent={value.percent}></Visualizer>
      <TblRow>
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
    </TblRowWrapper>
  );
}

export default TableRow;
