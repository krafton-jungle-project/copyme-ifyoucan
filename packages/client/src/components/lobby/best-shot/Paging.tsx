import Pagination from 'react-js-pagination';
import './Paging.css';
interface Props {
  page: number;
  count: number;
  setPage: (e: number) => void;
}
export const Paging = ({ page, count, setPage }: Props) => {
  return (
    <Pagination
      activePage={page}
      itemsCountPerPage={8}
      totalItemsCount={count}
      pageRangeDisplayed={5}
      prevPageText={'‹'}
      nextPageText={'›'}
      onChange={setPage}
    />
  );
};
