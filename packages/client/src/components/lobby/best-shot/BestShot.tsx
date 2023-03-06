import axios from 'axios';
import { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import transparentImg from '../../../assets/images/transparent.png';
import { ButtonClick2, ButtonClick3 } from '../../../utils/sound';
import { Paging } from './Paging';

const Container = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 90%;
`;

const ImgCardContainer = styled.div`
  position: absolute;
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: 50% 50%;
  top: 0;
  width: 100%;
  height: 90%;
`;

const ImgCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px 30px;
`;

const ImgWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  border: 1px solid #ff00cc66;
  border-radius: 5px;
  background-color: #ff00cc11;
`;

const DateTxt = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 10px;
  font-size: 16px;
  color: #fffb;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const PopUpContainer = styled.div<{ isPopUped: boolean }>`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000d;

  ${(props) =>
    props.isPopUped &&
    css`
      visibility: visible;
      animation: ${fadeIn} 0.5s;
      z-index: 1;
    `}

  ${(props) =>
    !props.isPopUped &&
    css`
      visibility: hidden;
      animation: ${fadeOut} 0.5s;
    `}

  transition: opacity 0.5s ease-in-out;
`;

const PopUpWrapper = styled.div`
  display: grid;
  grid-template-columns: 20% 60% 20%;
  grid-template-rows: calc(100% * 7 / 8) calc(100% * 1 / 8);
  height: 85%;
  max-width: 100%;
  aspect-ratio: 25 / 24;
`;

const PopUpImg = styled.img`
  width: 100%;
  height: 100%;
  border: 2px solid #ff3da5bb;
  border-radius: 10px;
`;

const MoveButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActButtonWrapper = styled.div`
  grid-column: 2 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button<{ btnType: string }>`
  width: 80px;
  height: 40px;
  font-size: 24px;
  font-weight: 800;
  border-radius: 10px;
  margin: 30px;
  transition: 0.25s;
  cursor: pointer;

  ${(props) =>
    props.btnType === 'move' &&
    css`
      width: 40px;
      color: #55a0dc;
      background-color: #55a0dc33;
      border-color: #55a0dc;
    `}

  ${(props) =>
    props.btnType === 'download' &&
    css`
      color: #8fc866;
      background-color: #8fc86633;
      border-color: #8fc866;
    `}
      
      ${(props) =>
    props.btnType === 'delete' &&
    css`
      color: #ef6eae;
      background-color: #ef6eae33;
      border-color: #ef6eae;
    `}
    
    ${(props) =>
    props.btnType === 'close' &&
    css`
      color: #e4cb58;
      background-color: #e4cb5833;
      border-color: #e4cb58;
    `}

  &:hover {
    box-shadow: 0 0.5em 0.5em -0.4em #fff;
    transform: translateY(-3px);
  }
`;

const NoPhotoAnnouncer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  line-height: 2;
  font-size: 24px;
  color: #fffb;
`;

function BestShot() {
  const [data, setData] = useState({ img: '', i: 0 });
  const [images, setImages] = useState<string[]>([]);
  const [count, setCount] = useState(0); // 사진 총 개수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [postPerPage] = useState(8); // 페이지당 사진 개수
  const [indexOfFirstPost, setIndexOfFirstPost] = useState(0);
  const [indexOfLastPost, setIndexOfLastPost] = useState(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  const setPage = (e: number) => {
    ButtonClick3.play();
    setCurrentPage(e);
  };

  useEffect(() => {
    setCount(images.length);
    setIndexOfLastPost(currentPage * postPerPage);
    setIndexOfFirstPost(indexOfLastPost - postPerPage);
    const tempImages = images.slice(indexOfFirstPost, indexOfLastPost);
    while (tempImages.length < 8) {
      tempImages.push('');
    }
    setCurrentImages(tempImages);
  }, [currentPage, indexOfFirstPost, indexOfLastPost, images, postPerPage]);

  useEffect(() => {
    const getMyImages = async () => {
      if (document.cookie) {
        const token = document.cookie.split('=')[1];
        try {
          const res = await axios.get(
            `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/users`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (res) {
            const imgurls = res.data.data.imgurl;
            setImages(imgurls.reverse());
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    getMyImages();
  }, []);

  const viewImage = async (img: string, i: number) => {
    ButtonClick2.play();
    setData({ img, i });
  };

  const imageToDate = (imageUrl: string) => {
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const timestamp = parseInt(filename.split('_')[0]);
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const imgAction = async (action: string) => {
    ButtonClick3.play();
    let i = data.i;

    switch (action) {
      case 'previous-img':
        // 현재 페이지에서 보여지는 사진 중 첫번째 사진이 아닐 때
        if (i !== 0) {
          // 이전 페이지로 이동
          setData({ img: currentImages[i - 1], i: i - 1 });
        }
        // 현재 페이지 사진 중 가장 첫번째 일 때
        else {
          // 현재 페이지가 가장 첫번째 페이지일 경우
          if (currentPage === 1) {
            alert('가장 최근 사진입니다!');
          }
          // 이전 페이지가 있다면
          else {
            setCurrentPage(currentPage - 1); // 이전 페이지로 이동
            setData({ img: images[indexOfFirstPost - 1], i: postPerPage - 1 }); // 이전 페이지의 마지막 이미지로 이동
          }
        }
        break;
      case 'next-img':
        // 현재 페이지에서 보여지는 사진의 수
        const currentImagesNum = images.slice(indexOfFirstPost, indexOfLastPost).length;

        // 현재 페이지에서 보여지는 사진 중 마지막 사진이 아닐 때
        if (i < currentImagesNum - 1) {
          // 다음 페이지로 이동
          setData({ img: currentImages[i + 1], i: i + 1 });
        }
        // 현재 페이지에서 보여지는 사진 중 마지막 사진일 때
        else {
          // 다음 페이지가 있다면(현재 페이지의 마지막 사진이 전체 사진의 마지막이 아닐 때)
          if (currentImages[currentImagesNum - 1] !== images[images.length - 1]) {
            setCurrentPage(currentPage + 1); // 다음 페이지로 이동
            setData({ img: images[indexOfFirstPost + postPerPage], i: 0 }); // 다음 페이지의 첫 이미지로 이동
          }
          // 전체 사진 중 마지막 사진일 때
          else {
            alert('가장 마지막 사진입니다!');
          }
        }
        break;
      case 'close':
        setData({ img: '', i: 0 });
        break;
      case 'download':
        const url = data.img;

        fetch(url)
          .then((response) => {
            return response.blob();
          })
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'bestshot.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        break;
      case 'delete':
        // data 상태 업데이트
        const check = window.confirm('정말로 삭제하시겠습니까?');
        if (check) {
          const token = document.cookie.split('=')[1];
          const key = data.img.split('/')[4];
          const config = { headers: { Authorization: `Bearer ${token}` } };
          try {
            const res = await axios.delete(
              `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/users/${key}`,
              config,
            ); // 서버와 통신하여 데이터 삭제
            if (res) {
              const newImgUrls = res.data.data.imgUrls;
              setImages(newImgUrls.reverse());
              setData({ img: '', i: 0 });
              alert('삭제되었습니다');
            }
          } catch (error) {
            console.log(error);
          }
        }

        break;
      default:
        break;
    }
  };

  return (
    <>
      {images.length === 0 ? (
        <NoPhotoAnnouncer>
          저장된 사진이 없습니다 🥺
          <br />
          게임을 즐기고 베스트샷을 만들어 보세요!
        </NoPhotoAnnouncer>
      ) : (
        <Container>
          <ImgCardContainer>
            {currentImages.map((image, i) => (
              <ImgCard key={i}>
                <ImgWrapper>
                  <Img
                    alt="best shot"
                    src={image ? image : transparentImg}
                    onClick={() => viewImage(image, i)}
                  />
                </ImgWrapper>
                <DateTxt>{image ? imageToDate(image) : '　'}</DateTxt>
              </ImgCard>
            ))}
          </ImgCardContainer>
          <Paging page={currentPage} count={count} setPage={setPage} />
        </Container>
      )}
      <PopUpContainer isPopUped={data.img !== ''}>
        <PopUpWrapper>
          <MoveButtonWrapper>
            <Button onClick={() => imgAction('previous-img')} btnType={'move'}>
              {'<'}
            </Button>
          </MoveButtonWrapper>
          <PopUpImg alt="popped-up best shot " src={data.img} />
          <MoveButtonWrapper>
            <Button onClick={() => imgAction('next-img')} btnType={'move'}>
              {'>'}
            </Button>
          </MoveButtonWrapper>
          <ActButtonWrapper>
            <Button onClick={() => imgAction('download')} btnType={'download'}>
              저장
            </Button>
            <Button onClick={() => imgAction('delete')} btnType={'delete'}>
              삭제
            </Button>
            <Button onClick={() => imgAction('close')} btnType={'close'}>
              닫기
            </Button>
          </ActButtonWrapper>
        </PopUpWrapper>
      </PopUpContainer>
    </>
  );
}

export default BestShot;
