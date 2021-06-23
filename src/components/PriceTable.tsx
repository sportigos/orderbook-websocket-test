import styled from "@emotion/styled";
import TableRow from './TableRow';

interface PriceTableProps {
  tbltype?: string;
  data?: {[key: string]: any}
}

const TablePage = styled.div<PriceTableProps>`
  flex: 1;
  padding: 8px;
  @media (min-width: 1024px) {
    padding: ${(p) => p.tbltype === "bid" ? "8px 0 8px 8px" : "8px 8px 8px 0"};
  }
`;

const DataWrapper = styled.div<PriceTableProps>`
  display: flex;
  flex-direction: ${(p) => p.tbltype === "bid" ? "column" : "column-reverse"};
  @media (min-width: 1024px) {
    flex-direction: column;
  }
`;

const PriceTable: React.FC<PriceTableProps> = ({ tbltype, data }) => {
  let sum = 0
  return (
    <TablePage tbltype={tbltype}>
      <TableRow
        tbltype={tbltype}
        header={true}
        value={{
          price: "PRICE",
          size: "SIZE",
          total: "TOTAL",
          percent: 0
        }}>
      </TableRow>
      <DataWrapper tbltype={tbltype}>
        {data && Object.keys(data).sort().map(key => {
          sum += data[key].size
          return (
            key === "total" ? '' :
              (
                <div key={key}>
                  <TableRow
                    tbltype={tbltype}
                    value={{
                      price: key,
                      size: data[key].size,
                      total: sum,
                      percent: Math.max(sum * 100 / data.total, 1)
                    }}>
                  </TableRow>
                </div>
              )
          )
        })}
      </DataWrapper>
    </TablePage>
  );
}

export default PriceTable;
