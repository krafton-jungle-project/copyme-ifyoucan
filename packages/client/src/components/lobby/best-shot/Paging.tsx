import Pagination from 'react-js-pagination';
import styled from 'styled-components';
import './Paging.css';

const PagingWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  width: 100%;
  height: 10%;
`;

interface Props {
  page: number;
  count: number;
  setPage: (e: number) => void;
}

export const Paging = ({ page, count, setPage }: Props) => {
  return (
    <PagingWrapper>
      <Pagination
        activePage={page}
        itemsCountPerPage={8}
        totalItemsCount={count}
        pageRangeDisplayed={5}
        prevPageText={'<'}
        nextPageText={'>'}
        onChange={setPage}
      />
    </PagingWrapper>
  );
};
