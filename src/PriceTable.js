import styled from "@emotion/styled";
import TableRow from './TableRow';

const TablePage = styled.div`
  flex: 1;
  padding: ${(p) => p.type === "bid" ? "8px 0 8px 8px" : "8px 8px 8px 0"};
`;

function PriceTable({ type, data }) {
  let total = 0
  if(data !== undefined) total = data.total

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
    </TablePage>
  );
}

export default PriceTable;
