import { createContext, useContext } from "react";
import styled from "styled-components";

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const CommonRow = styled.div`
  display: grid;
  // 4. Here I get the props.columns for grid columns template
  grid-template-columns: ${(props) => props.columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  /* This will hide the footer when it contains no child elements. Possible thanks to the parent selector :has 🎉 */
  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

// 1. Create the Context variable
const TableContext = createContext()


function Table({columns, children}) {
  // 2. Define Provider inside Father component 
  return (
    <TableContext.Provider value={{columns}}>
      <StyledTable role="table">
        {children}
      </StyledTable>
    </TableContext.Provider>
  )
}

// Child Component For Table Header
function Header({children}) {
  // 3. Get columns value from TableContext
  const { columns } = useContext(TableContext)

  return (
    <StyledHeader role="row" columns={columns} as='header'>
      {children}
    </StyledHeader>
  )
}

// Child Component For Table Rows
function Row({children}) {
  // 5. Get columns value from TableContext
  const { columns } = useContext(TableContext)

  return (
    <StyledRow role="row" columns={columns}>
      {children}
    </StyledRow>
  )
}

//6. Child Component For Table Body, get data and render prop
function Body({data, render}) {
  
  if (data.length === 0) return <Empty>No data to show at the moment</Empty>
  
  return (
    <StyledBody>
      {data.map(render)}
    </StyledBody>
  )


}

// 7. Export all child components and the father itself
Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;


export default Table
