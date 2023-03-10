import axios from 'axios';
import { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import transparentImg from '../../../assets/images/transparent.png';
import { ButtonClick2, ButtonClick3, ButtonClick4 } from '../../../utils/sound';
import { Paging } from './Paging';

const Container = styled.div`
  position: absolute;
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
  border: 1px solid #f0c6;
  border-radius: 5px;
  background-color: #f0c1;
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
  const [count, setCount] = useState(0); // ?????? ??? ??????
  const [currentPage, setCurrentPage] = useState(1); // ?????? ?????????
  const [postPerPage] = useState(8); // ???????????? ?????? ??????
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
        // ?????? ??????????????? ???????????? ?????? ??? ????????? ????????? ?????? ???
        if (i !== 0) {
          // ?????? ???????????? ??????
          setData({ img: currentImages[i - 1], i: i - 1 });
        }
        // ?????? ????????? ?????? ??? ?????? ????????? ??? ???
        else {
          // ?????? ???????????? ?????? ????????? ???????????? ??????
          if (currentPage === 1) {
            alert('?????? ?????? ???????????????!');
          }
          // ?????? ???????????? ?????????
          else {
            setCurrentPage(currentPage - 1); // ?????? ???????????? ??????
            setData({ img: images[indexOfFirstPost - 1], i: postPerPage - 1 }); // ?????? ???????????? ????????? ???????????? ??????
          }
        }
        break;
      case 'next-img':
        // ?????? ??????????????? ???????????? ????????? ???
        const currentImagesNum = images.slice(indexOfFirstPost, indexOfLastPost).length;

        // ?????? ??????????????? ???????????? ?????? ??? ????????? ????????? ?????? ???
        if (i < currentImagesNum - 1) {
          // ?????? ???????????? ??????
          setData({ img: currentImages[i + 1], i: i + 1 });
        }
        // ?????? ??????????????? ???????????? ?????? ??? ????????? ????????? ???
        else {
          // ?????? ???????????? ?????????(?????? ???????????? ????????? ????????? ?????? ????????? ???????????? ?????? ???)
          if (currentImages[currentImagesNum - 1] !== images[images.length - 1]) {
            setCurrentPage(currentPage + 1); // ?????? ???????????? ??????
            setData({ img: images[indexOfFirstPost + postPerPage], i: 0 }); // ?????? ???????????? ??? ???????????? ??????
          }
          // ?????? ?????? ??? ????????? ????????? ???
          else {
            alert('?????? ????????? ???????????????!');
          }
        }
        break;
      case 'close':
        setData({ img: '', i: 0 });
        break;
      case 'download':
        const token = document.cookie.split('=')[1];
        const key = data.img.split('/')[4];
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
          const res = await axios.get(
            `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/users/download/${key}`,
            config,
          ); // ????????? ???????????? ????????? ??????}
          const fileStream = res.data.data.data.s3Object;
          const myBlob = new Blob([new Uint8Array([...fileStream.Body.data]).buffer], {
            type: fileStream.ContentType,
          });
          const blobUrl = URL.createObjectURL(myBlob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'bestshot.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.log(error);
        }
        break;
      case 'delete':
        // data ?????? ????????????
        const check = window.confirm('????????? ?????????????????????????');
        if (check) {
          const token = document.cookie.split('=')[1];
          const key = data.img.split('/')[4];
          const config = { headers: { Authorization: `Bearer ${token}` } };
          try {
            const res = await axios.delete(
              `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/users/${key}`,
              config,
            ); // ????????? ???????????? ????????? ??????
            if (res) {
              const newImgUrls = res.data.data.imgUrls;
              setImages(newImgUrls.reverse());
              setData({ img: '', i: 0 });
              ButtonClick4.play();
              alert('?????????????????????');
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          ButtonClick2.play();
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
          ????????? ????????? ???????????? ????
          <br />
          ????????? ????????? ??????????????? ????????? ?????????!
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
                <DateTxt>{image ? imageToDate(image) : '???'}</DateTxt>
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
              ??????
            </Button>
            <Button onClick={() => imgAction('delete')} btnType={'delete'}>
              ??????
            </Button>
            <Button onClick={() => imgAction('close')} btnType={'close'}>
              ??????
            </Button>
          </ActButtonWrapper>
        </PopUpWrapper>
      </PopUpContainer>
    </>
  );
}

export default BestShot;
