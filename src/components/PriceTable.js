import styled from "@emotion/styled";
import TableRow from './TableRow';

const TablePage = styled.div`
  flex: 1;
  padding: 8px;
  @media (min-width: 1024px) {
    padding: ${(p) => p.type === "bid" ? "8px 0 8px 8px" : "8px 8px 8px 0"};
  }
`;

const DataWrapper = styled.div`
  display: flex;
  flex-direction: ${(p) => p.type === "bid" ? "column" : "column-reverse"};
  @media (min-width: 1024px) {
    flex-direction: column;
  }
`;

function PriceTable({ type, data }) {
  let total = data.total

  return (
    <TablePage type={type}>
      <TableRow
        type={type}
        header={true}
        value={{
          price: "PRICE",
          size: "SIZE",
          total: "TOTAL",
          percent: 0
        }}>
      </TableRow>
      <DataWrapper type={type}>
        {data && Object.keys(data).map(key => (
          key === "total" ? '' :
            (
              <div key={key}>
                <TableRow
                  type={type}
                  value={{
                    price: key,
                    size: data[key].size,
                    total: data[key].total,
                    percent: Math.max(data[key].total * 100 / total, 1)
                  }}>
                </TableRow>
              </div>
            )
        ))}
      </DataWrapper>
    </TablePage>
  );
}

export default PriceTable;
