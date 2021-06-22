import styled from "@emotion/styled";

const TblRowWrapper = styled.div`
  font-weight: bold;
  line-height: 150%;
  position: relative;
  display: ${(p) => p.header === true && p.type === "bid" ? "none" : "block"};
  @media (min-width: 1024px) {
    display: block;
  }
`;

const VisualizeBar = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  :after {
    content: '';
    position: absolute;
    background: ${(p) => p.header === true ? "#00000000" : p.type === "bid" ? "#3e212c" : "#103839"};
    top: 0;
    bottom: 0;
    right: 0;
    @media (min-width: 1024px) {
      right: ${(p) => p.type === "bid" ? "0" : "auto"};
      left: ${(p) => p.type === "bid" ? "auto" : "0"};
    }
    width: ${(p) => `${parseInt(p.percent)}%`};
  }
`;

const TblRow = styled.div`
  display: flex;
  flex-direction: row-reverse;
  @media (min-width: 1024px) {
    flex-direction: ${(p) => p.type === "bid" ? "row" : "row-reverse"};
  }
  padding: ${(p) => p.header === true ? "12px 60px" : "8px 60px"}; 
`;

const TblCell = styled.div`
  color: ${(p) => p.header === true ? "#6d7482" : p.celltype !== "price" ? "white" : p.type === "bid" ? "#d33e41" : "#0e9d71"};
  @media (min-width: 1024px) {
    color: ${(p) => p.header === true ? "#6d7482" : p.celltype === "price" ? "#0e9d71" : "white"};
  }
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

  console.log("percent", value.percent)

  return (
    <TblRowWrapper type={type} header={header}>
      <VisualizeBar type={type} header={header} percent={value.percent}></VisualizeBar>
      <TblRow type={type} header={header}>
        <TblCell
          type={type}
          header={header}
          celltype="total">
          {numberWithCommas(value.total)}
        </TblCell>
        <TblCell
          type={type}
          header={header}
          celltype="size">
          {numberWithCommas(value.size)}
        </TblCell>
        <TblCell
          type={type}
          header={header}
          celltype="price">
          {numberWithCommas(value.price)}
        </TblCell>
      </TblRow>
    </TblRowWrapper>
  );
}

export default TableRow;
