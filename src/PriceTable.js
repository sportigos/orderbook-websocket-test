import styled from "@emotion/styled";
import TableRow from './TableRow';

const TablePage = styled.div`
  flex: 1;
  padding: 8px 40px;
`;

function PriceTable({ type, data }) {

  return (
    <TablePage>
      <TableRow
        type={type}
        header={true}
        value={{ price: "PRICE", size: "SIZE", total: "TOTAL" }}>
      </TableRow>
      {Object.keys(data).map(key => (
        <div key={key}>
          <TableRow
            type={type}
            value={{price: key, size: data[key].size, total: data[key].total}}>
          </TableRow>
        </div>
      ))}
    </TablePage>
  );
}

export default PriceTable;
